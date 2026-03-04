import type {TokenPayload} from "../../types/dto/authDTO.types.ts";
import {AppError} from "../../error/appError.ts";
import type {Response} from "express";



// Хелпер для безпечного доступу до locals
//const getContext = <T = any, V = any, P = any>(res: Response) => res.locals as AppRequestContext<T, V, P>;

export const extractPayloadOrThrow = (res: Response): TokenPayload => {
    const payload = res.locals.payload;

    if (!payload) {
        throw new AppError({
            message: "payload з даними користувача відсутній",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        });
    }
    return payload;
};

export const extractValidatedBodyOrThrow = <T>(res: Response): T => {
    const validatedBody = res.locals.validatedBody;
    if (!validatedBody) {
        throw new AppError({
            message: "Звалідоване тіло запиту відсутнє",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        })
    }
    return validatedBody as T;
};

export const extractValidatedQueryOrThrow = <V>(res: Response): V => {
    const validatedQuery = res.locals.validatedQuery;

    if (!validatedQuery) {
        throw new AppError({
            message: "Звалідовані параметри запиту відсутні",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        })
    }
    return validatedQuery as V;
};

export const extractValidatedParamsOrThrow = <P>(res: Response): P => {
    const validatedParams = res.locals.validatedParams;
    if (!validatedParams) {
        throw new AppError({
            message: "Звалідовані параметри url запиту відсутні",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        })
    }
    return validatedParams as P;
};