import type {Request, Response, NextFunction} from "express";
import {z} from "zod";
import {AppError} from "../../shared/error/app.error.ts";
import {config} from "../../shared/infrastructure/config/index.ts";
import {ConflictError, InternalServerError, NotFoundError, ValidationError} from "../../shared/error/custom.errors.ts";
import {Prisma} from "@prisma/client";




//Цей middleware для централізованої обробки помилок в server.ts
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let finalError: AppError | null = null;


    // 1. Перетворюємо специфічні помилки у наш формат AppError
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
                const details = config.isDev ? {fields: targets} : undefined;

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

    // 3. Всі інші непередбачені помилки
    if(!finalError) {
        finalError = new InternalServerError();
    }

    console.error(finalError);

    return res.status(finalError.statusCode).json(finalError);
};