import type {Request} from "express";
import type {TokenPayload} from "../types/dto/authDTO.types.ts";
import jwt from "jsonwebtoken";
import {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} from "../config/index.ts";
import {AppError} from "../error/appError.ts";
import type {UserRole} from "../types/models/custom/user.model.ts";

//Метод для отримання jwt токена з хедера
export const extractAccessToken = (req: Request): string | undefined => {
    const authHeader: string | undefined = req.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const accessToken: string = authHeader.split(" ")[1];
        return accessToken;
    }

    return undefined;
}

export function generateAccessToken(payload: TokenPayload) {
    const accessToken: string =  jwt.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
    return accessToken;
}

export function generateRefreshToken(payload: TokenPayload) {
    const refreshToken: string = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    return refreshToken;
}

export const validateAccessToken = (accessToken: string): TokenPayload | null => {
    try {
        const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        return payload as TokenPayload;
    } catch (error) {
        return null;
    }
}

export const validateRefreshToken = (refreshToken: string): TokenPayload | null => {
    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        return payload as TokenPayload;
    } catch (error) {
        return null;
    }
}

//Метод для перевірки відповідності ролі користувача одній із необхідних
export const checkAccess = (currentRole: UserRole, allowedRoles: UserRole[]): boolean => {
    const hasAccess: boolean = allowedRoles.includes(currentRole);

    return hasAccess;
}