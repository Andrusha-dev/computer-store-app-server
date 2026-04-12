import type {Request, Response} from "express";
import {AppError} from "../../shared/error/app.error.ts";
import type {TokenPayload} from "../../shared/types/token-payload.schema.ts";




//Метод для екстракції jwt токена з хедера
export const extractAccessTokenOrThrow = (req: Request): string => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError({
            message: "access токен відсутній",
            code: "UNAUTHORIZED",
            statusCode: 401
        });


    }

    const accessToken = authHeader.split(" ")[1];
    return accessToken;
}


export const extractTokenPayloadOrThrow = (res: Response): TokenPayload => {
    const tokenPayload = res.locals.tokenPayload;

    if (!tokenPayload) {
        console.log("Token payload is undefined");
        throw new AppError({
            message: "payload з даними користувача відсутній",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        });

    }
    return tokenPayload;
};

export const extractValidatedBodyOrThrow = <T>(res: Response): T => {
    const validatedBody = res.locals.validatedBody;
    if (!validatedBody) {
        console.log("Validated body is undefined");
        throw new AppError({
            message: "Звалідоване тіло запиту відсутнє",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        });
    }
    return validatedBody as T;
};

export const extractValidatedQueryOrThrow = <V>(res: Response): V => {
    const validatedQuery = res.locals.validatedQuery;

    if (!validatedQuery) {
        console.log("Validated query is undefined");
        throw new AppError({
            message: "Звалідовані параметри запиту відсутні",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        });
    }
    return validatedQuery as V;
};

export const extractValidatedParamsOrThrow = <P>(res: Response): P => {
    const validatedParams = res.locals.validatedParams;
    if (!validatedParams) {
        console.log("Validated params is undefined");
        throw new AppError({
            message: "Звалідовані параметри url запиту відсутні",
            code: "INTERNAL_SERVER_ERROR",
            statusCode: 500
        });
    }
    return validatedParams as P;
};


