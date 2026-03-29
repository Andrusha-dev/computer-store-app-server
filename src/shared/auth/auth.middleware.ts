import type {NextFunction, Response, Request} from "express";
import {extractAccessTokenOrThrow, extractTokenPayloadOrThrow} from "../http/express.helpers.ts";
import type {UserRole} from "./auth.schema.ts";
import type {IAuthMiddleware} from "./auth.contract.ts";
import type {IJwtProvider} from "../../infrastructure/auth/jwt.provider.ts";
import {UnauthorizedError} from "../../core/errors/custom.errors.ts";
import {ensureAccess} from "./auth.helper.ts";




interface Dependencies {
    jwtProvider: IJwtProvider;
}


export class  AuthMiddleware implements IAuthMiddleware {
    private readonly jwtProvider: IJwtProvider;

    constructor({jwtProvider}: Dependencies) {
        this.jwtProvider = jwtProvider;
    }


    authenticate = (req: Request, res: Response, next: NextFunction): void => {
        const accessToken = extractAccessTokenOrThrow(req);

        const payload = this.jwtProvider.verifyAccess(accessToken);
        if(!payload) {
            throw new UnauthorizedError("access токен недійсний чи некоректний");
        }

        console.log("EXTRACTED PAYLOAD: ", payload);

        res.locals.tokenPayload = payload;

        next();
    }

    authorize = (allowedRoles: UserRole[]) =>
        (req: Request, res: Response, next: NextFunction): void => {
            const user = extractTokenPayloadOrThrow(res);

            ensureAccess(user.role, allowedRoles);

            next();
        }
}