import type {NextFunction, Request, Response} from "express";
import {validateAccessToken, validateRole} from "../services/authService.ts";
import type {TokenPayload} from "../types/dto/authDTO.types.ts";
import {AppError} from "../error/appError.ts";
import type {UserRole} from "../types/models/custom/user.model.ts";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!accessToken) {
        throw new AppError({
            message: "access токен відсутній",
            code: "UNAUTHORIZED",
            statusCode: 401
        });
    }


    const payload = validateAccessToken(accessToken);
    res.locals.payload = payload as TokenPayload;
    next();
};

export const authorizeRole = (roles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const payload: TokenPayload = res.locals.payload as TokenPayload;

        //Перевіряє чи наявність role в payload та її відповідність одній з необхідних ролей roles
        validateRole(payload, roles);

        next();
    };