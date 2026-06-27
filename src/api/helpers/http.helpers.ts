import type {Request} from "express";
import type {TokenPayload} from "../../shared/schemas/token-payload.schema";
import {InternalServerError, UnauthorizedError} from "../../shared/error/custom.errors";
import type {QueryParams} from "../types/http.types";




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
export const extractTokenPayloadOrThrow = (req: Request): TokenPayload => {
    const tokenPayload = req.tokenPayload;

    if (!tokenPayload) {
        throw new InternalServerError("payload з даними користувача відсутній");
    }
    return tokenPayload;
};

//Метод для екстрації звалідованого тіла запиту після спрацювання мідлвари validate
export const extractValidatedBodyOrThrow = <T>(req: Request): T => {
    if(!req.valid) {
        throw new InternalServerError("Будь-які звалідовані дані відсутні");
    }

    const validatedBody = req.valid.body;
    if (!validatedBody) {
        throw new InternalServerError("Звалідоване тіло запиту відсутнє");
    }

    return validatedBody as T;
};

//Метод для екстрації звалідованих параметрів запиту після спрацювання мідлвари validate
export const extractValidatedQueryOrThrow = <T>(req: Request): T => {
    if(!req.valid) {
        throw new InternalServerError("Будь-які звалідовані дані відсутні");
    }

    const validatedQuery = req.valid.query;

    if (!validatedQuery) {
        throw new InternalServerError("Звалідовані параметри запиту відсутні");
    }

    return validatedQuery as T;
};

//Метод для екстрації звалідованих параметрів url після спрацювання мідлвари validate
export const extractValidatedParamsOrThrow = <T>(req: Request): T => {
    if(!req.valid) {
        throw new InternalServerError("Будь-які звалідовані дані відсутні");
    }

    const validatedParams = req.valid.params;
    if (!validatedParams) {
        throw new InternalServerError("Звалідовані параметри url запиту відсутні");
    }
    return validatedParams as T;
};


//Метод для попередньої обробки обєкту з параметрами запиту queryParams, а саме прибирання квадратних дужок в назвах полів
//для можливості подальшої валідації
export const normalizeQueryParams = (queryParams: Record<string, any>): QueryParams => {
    const normalizedQueryParams: QueryParams = {};
    Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key];
        if(typeof value === "string" || Array.isArray(value) && value.every((item) => typeof item === "string") || typeof value === "undefined") {
            const newKey = key.replace("[]", "");
            normalizedQueryParams[newKey] = value;
        } else {
            console.log("Type of value are included object or array of includes object.");
        }

    });

    return normalizedQueryParams;
}


