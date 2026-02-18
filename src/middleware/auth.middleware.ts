import type {NextFunction, Request, Response} from "express";
import type {TokenPayload} from "../types/dto/authDTO.types.ts";
import {AppError} from "../error/appError.ts";
import type {UserRole} from "../types/models/custom/user.model.ts";
import {checkAccess, extractAccessToken, validateAccessToken} from "../utils/auth.utils.ts";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string | undefined = extractAccessToken(req);
    if (!accessToken) {
        throw new AppError({
            message: "access токен відсутній",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }

    const payload: TokenPayload | null = validateAccessToken(accessToken);
    if(!payload) {
        throw new AppError({
            message: "access токен недійсний",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }

    res.locals.payload = payload;
    next();
};

export const authorizeRole = (roles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const payload = res.locals.payload;

        if (!payload) {
            throw new AppError({
                message: "Користувач не авторизований або дані відсутні",
                code: "UNAUTHORIZED",
                statusCode: 401
            });
        }

        // Тепер ми впевнені, що payload існує і передаємо його в утиліту
        const tokenPayload: TokenPayload = payload as TokenPayload;
        const hasAccess: boolean = checkAccess(tokenPayload.role, roles);
        if(!hasAccess) {
            throw new AppError({
                message: "Користувач не має необхідних прав доступу",
                code: "FORBIDDEN",
                statusCode: 403
            });
        }

        next();
    };