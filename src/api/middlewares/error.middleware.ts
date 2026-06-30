import type {Request, Response, NextFunction} from "express";
import {z} from "zod";
import {AppError} from "../../shared/error/app.error";
import {type Config} from "../../shared/infrastructure/config/index";
import {ConflictError, InternalServerError, NotFoundError, ValidationError} from "../../shared/error/custom.errors";
import {Prisma} from "../../../prisma/generated/client";
import type {ILoggerService} from "../../shared/contracts/logger.contract";


interface Dependencies {
    config: Config
    logger: ILoggerService;
}


//Цей middleware для централізованої обробки помилок в server.ts
export class ErrorHandler {
    private readonly config: Config;
    private readonly logger: ILoggerService;

    constructor({config, logger}: Dependencies) {
        this.config = config;
        this.logger = logger;
    }

    handle = (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        let finalError: AppError | null = null;

        //Контекст запиту, щоб відразу бачити в логах, де саме сталася проблема
        const requestContext = {
            method: req.method,
            url: req.url,
            ip: req.ip,
        };


        //Перетворюємо специфічні помилки у наш формат AppError
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            //Помилка PrismaClientKnownRequestError може мати різні причини, тому слід створити екземпляр AppError
            //з конкретними даними помилки за допомогою відповідного методу
            switch (err.code) {
                case 'P2002':
                    //Отримуємо деталі про поля, в яких виник конфлікт
                    //Згідно документації Prisma для помилок P2002, конфліктні поля
                    // розміщуються в обєкті err.meta.target який має тип string[]
                    const targets: string[] = (err.meta?.target as string[]) || [];
                    const fields: string = targets.length > 0 ? targets.join(', ') : "";
                    const details = this.config.isProduction ? undefined : {fields: targets};

                    finalError = new ConflictError(fields, details);
                    break;
                case 'P2025':
                    finalError = new NotFoundError();
                    break;
                default:
                    finalError = new InternalServerError('Помилка бази даних');
            }
        }


        if (err instanceof z.ZodError) {
            const details = z.treeifyError(err);

            finalError = new ValidationError(details);
        }


        if(err instanceof AppError) {
            finalError = err;
        }

        //Всі інші непередбачені помилки
        if(!finalError) {
            finalError = new InternalServerError();
        }

        //console.error(finalError);
        if (finalError.statusCode >= 500) {
            // КРИТИЧНІ ПОМИЛКИ (500 і вище) — логуємо як error, передаємо ОРИГІНАЛЬНИЙ err для збереження stack-trace
            this.logger.error(`[Internal Server Error]: ${finalError.message}`, err, {
                ...requestContext,
                statusCode: finalError.statusCode
            });
        } else {
            // Всі інші клієнтські помилки (400, 404, 409, 401, 403, 422) — рівень warn
            this.logger.warn(`[Client Error]: ${finalError.message}`, {
                ...requestContext,
                statusCode: finalError.statusCode
            });
        }


        res.status(finalError.statusCode).json(finalError);
    };
}