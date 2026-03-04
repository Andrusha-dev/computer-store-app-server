import type {Request} from "express";
import {type TokenPayload, tokenPayloadSchema} from "../types/dto/authDTO.types.ts";
import jwt from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from "../config/index.ts";
import {AppError} from "../error/appError.ts";
import type {UserRole} from "../types/models/custom/user.model.ts";


//Метод для отримання jwt токена з хедера
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

export function generateAccessToken(payload: TokenPayload) {
    const accessToken: string =  jwt.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
    return accessToken;
}

export function generateRefreshToken(payload: TokenPayload) {
    const refreshToken: string = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    return refreshToken;
}

export const validateAccessTokenOrThrow = (accessToken: string): TokenPayload => {
    try {
        const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        const tokenPayload: TokenPayload = tokenPayloadSchema.parse(payload);
        console.log("VALIDATED TOKEN PAYLOAD: ", payload);

        return tokenPayload;
    } catch (error) {
        throw new AppError({
            message: "access токен недійсний чи не коректний",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }
}

export const validateRefreshTokenOrThrow = (refreshToken: string): TokenPayload => {
    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const tokenPayload: TokenPayload = tokenPayloadSchema.parse(payload);
        return tokenPayload;
    } catch (error) {
        throw new AppError({
            message: "refresh токен недійсний чи не коректний",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }
}

//чистий хелпер для перевірки відповідності ролі користувача
export const checkAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
    const hasAccess: boolean = allowedRoles.includes(userRole);
    return hasAccess;
}

//Хелпер з генерацією помилки для перевірки відповідності ролі користувача
export const ensureAccessOrThrow = (userRole: UserRole, allowedRoles: UserRole[]): void => {
    const hasAccess: boolean = checkAccess(userRole, allowedRoles);
    if(!hasAccess) {
        throw new AppError({
            message: "Користувач не має необхідних прав доступу",
            code: "FORBIDDEN",
            statusCode: 403
        });
    }
}