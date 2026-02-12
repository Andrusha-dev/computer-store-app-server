import jwt, {type JwtPayload} from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/index.ts";
import {
    type LoginRequest, type LoginResponse, loginResponseSchema,
    type TokenPayload
} from "../types/dto/authDTO.types.ts";
import prisma from "../lib/prisma.ts";
import type {User, UserWithRelations} from "../types/models/generated";
import {AppError} from "../error/appError.ts";
import type {UserRole} from "../types/models/custom/user.model.ts";
import type {LoginResult, RefreshAllTokensResult} from "../types/services/results/auth.results.ts";
import type {LoginArgs, RefreshAllTokensArgs} from "../types/services/args/auth.args.ts";
import {string} from "zod"; // Імпортуємо секрети з конфігурації



export function generateAccessToken(payload: TokenPayload) {
    const accessToken: string =  jwt.sign(payload, ACCESS_TOKEN_SECRET); // Токен действует 1 час
    return accessToken;
}

export function generateRefreshToken(payload: TokenPayload) {
    const refreshToken: string = jwt.sign(payload, REFRESH_TOKEN_SECRET);
    return refreshToken;
}

export const validateAccessToken = (accessToken: string): TokenPayload => {
    try {
        const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        return payload as TokenPayload;
    } catch (error) {
        throw new AppError({
            message: "access токен недійсний",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }
}

export const validateRefreshToken = (refreshToken: string): TokenPayload => {
    try {
        const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        return payload as TokenPayload;
    } catch (error) {
        throw new AppError({
            message: "refresh токен недійсний",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }
}

//Метод для перевірки відповідності ролі користувача одній із необхідних
export const validateRole = (payload: TokenPayload | undefined | null, necessaryRoles: UserRole[]): UserRole => {
    const userRole: UserRole | undefined = payload?.role;
    if(!userRole) {
        throw new AppError({
            message: "Роль користувача не відома",
            code: "FORBIDDEN",
            statusCode: 403
        });
    }

    const hasNecessaryRole: boolean = necessaryRoles.includes(userRole);
    if(!hasNecessaryRole) {
        throw new AppError({
            message: "Користувач не має необхідних прав доступу",
            code: "FORBIDDEN",
            statusCode: 403
        });
    }

    return userRole;
}




export const login = async (loginArgs: LoginArgs): Promise<LoginResult> => {
    const {email, password} = loginArgs;


    const user: User = await prisma.user.findFirstOrThrow({
        where: {
            email: email,
            password: password
        },
        //властивість include з властивістю address вказується тоді, коли потрібен повний обєкт User
        //бо по змовчуванню prisma поверне User без поля address, а додавши address Отримуємо UserWithRelations.
        // В моєму випадку мені це не потрібно
        //include: {
            //address: true
        //}
    });

    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    const accessToken = generateAccessToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 60
    });
    console.log("Starting access token: ", accessToken);
    const refreshToken = generateRefreshToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + 60 * 2
    });

    const loginResult: LoginResult = {
        user: user,
        accessToken,
        refreshToken,
    }

    return loginResult;
}

export const refreshAllTokens = (refreshAllTokensArgs: RefreshAllTokensArgs): RefreshAllTokensResult => {
    const {refreshToken} = refreshAllTokensArgs;
    const payload: TokenPayload = validateRefreshToken(refreshToken);

    const newAccessToken: string = generateAccessToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: Date.now() / 1000 + 60
    });
    const newRefreshToken: string = generateRefreshToken({
        ...payload,
        iat: Date.now() / 1000,
        exp: (Date.now() / 1000) + 60 * 2
    });
    console.log("New access token: ", newAccessToken);
    console.log("new refreshToken: ", refreshToken);

    const refreshAllTokensResult: RefreshAllTokensResult = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }


    return refreshAllTokensResult;
}