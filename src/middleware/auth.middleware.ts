import type {NextFunction, Request, Response} from "express";
import type {UserRole} from "../types/models/custom/user.model.ts";
import {ensureAccessOrThrow, extractAccessTokenOrThrow, validateAccessTokenOrThrow} from "../utils/auth.utils.ts";
import {extractPayloadOrThrow} from "../utils/request/extractors.utils.ts";


export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const accessToken = extractAccessTokenOrThrow(req);

    const payload = validateAccessTokenOrThrow(accessToken);

    console.log("EXTRACTED PAYLOAD: ", payload);

    res.locals.payload = payload;

    next();
};

export const authorizeRole = (roles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const payload = extractPayloadOrThrow(res);

        ensureAccessOrThrow(payload.role, roles);

        next();
    };