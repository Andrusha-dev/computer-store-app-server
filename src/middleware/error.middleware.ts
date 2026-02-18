import type {Request, Response, NextFunction} from "express";
import {z} from "zod";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {AppError} from "../error/appError.ts";
import type {ErrorResponse} from "../types/dto/error.dto.ts";
import {isDevelopment} from "../config/index.ts";



//Цей middleware для централізованої обробки помилок в server.ts
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // 1. Перетворюємо специфічні помилки у наш формат AppError
    if (err instanceof PrismaClientKnownRequestError) {
        //Помилка PrismaClientKnownRequestError може мати різні причини, тому слід створити екземпляр AppError
        //з конкретними даними помилки за допомогою відповідного методу
        const error: AppError = handlePrismaError(err);

        return sendErrorResponse(res, error);
    }


    if (err instanceof z.ZodError) {


        const error: AppError = new AppError({
            message: 'При валідації даних виникла помилка.',
            statusCode: 422,
            code: "VALIDATION_ERROR",
            details: isDevelopment ? {issues: err.issues} : undefined
        });

        return sendErrorResponse(res, error);
    }


    if(err instanceof AppError) {
        return sendErrorResponse(res, err);
    }

    // 3. Всі інші непередбачені помилки
    console.error(err);
    const error: AppError = new AppError({
        message: "Внутрішня помилка сервера",
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500
    })
    return sendErrorResponse(res, error)
};


const handlePrismaError = (err: PrismaClientKnownRequestError) => {
    switch (err.code) {
        case 'P2002':
            //Отримуємо деталі про поля, в яких виник конфлікт
            const targets: string[] = (err.meta?.target as string[]) || [];
            const fields: string = targets.join(', ');

            return new AppError({
                message: `Запис із таким значенням для полів ${fields} уже існує`,
                code: "CONFLICT",
                statusCode: 409,
                details: {
                    fields: targets
                }
            });
        case 'P2025':
            return new AppError({
                message: 'Запис не знайдено',
                code: "NOT_FOUND",
                statusCode: 404
            });
        default:
            return new AppError({
                message: 'Помилка бази даних',
                code: "INTERNAL_SERVER_ERROR",
                statusCode: 500
            });
    }
};

const sendErrorResponse = (res: Response, error: AppError) => {
    const errorResponse: ErrorResponse = {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
    }

    return res.status(errorResponse.statusCode).json(errorResponse);
}