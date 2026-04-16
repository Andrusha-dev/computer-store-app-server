import type {Request, Response} from "express";
import type {TokenPayload} from "../../shared/schemas/token-payload.schema.ts";
import {InternalServerError, UnauthorizedError} from "../../shared/error/custom.errors.ts";




//Метод для екстракції jwt токена з хедера
export const extractAccessTokenOrThrow = (req: Request): string => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("access токен відсутній");
    }

    const accessToken = authHeader.split(" ")[1];
    return accessToken;
}

//Метод для екстракції TokenPayload після спрацювання AuthMiddleware
export const extractTokenPayloadOrThrow = (res: Response): TokenPayload => {
    const tokenPayload = res.locals.tokenPayload;

    if (!tokenPayload) {
        throw new InternalServerError("payload з даними користувача відсутній");
    }
    return tokenPayload;
};

//Метод для екстрації звалідованого тіла запиту після спрацювання мідлвари validate
export const extractValidatedBodyOrThrow = <T>(res: Response): T => {
    const validatedBody = res.locals.validatedBody;
    if (!validatedBody) {
        throw new InternalServerError("Звалідоване тіло запиту відсутнє");
    }
    return validatedBody as T;
};

//Метод для екстрації звалідованих параметрів запиту після спрацювання мідлвари validate
export const extractValidatedQueryOrThrow = <V>(res: Response): V => {
    const validatedQuery = res.locals.validatedQuery;

    if (!validatedQuery) {
        throw new InternalServerError("Звалідовані параметри запиту відсутні");
    }
    return validatedQuery as V;
};

//Метод для екстрації звалідованих параметрів url після спрацювання мідлвари validate
export const extractValidatedParamsOrThrow = <P>(res: Response): P => {
    const validatedParams = res.locals.validatedParams;
    if (!validatedParams) {
        throw new InternalServerError("Звалідовані параметри url запиту відсутні");
    }
    return validatedParams as P;
};


