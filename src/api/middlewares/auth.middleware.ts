import type {NextFunction, Response, Request} from "express";
import {extractAccessTokenOrThrow, extractTokenPayloadOrThrow} from "../helpers/http.helpers.ts";
import type {IAuthMiddleware} from "../../shared/contracts/auth.middleware.contract.ts";
import {ForbiddenError, UnauthorizedError} from "../../shared/error/custom.errors.ts";
import type {IJwtProvider} from "../../shared/contracts/jwt.contract.ts";
import type {UserRole} from "../../shared/types/user-role.schema.ts";




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
            const tokenPayload = extractTokenPayloadOrThrow(res);

            const hasAccess =  allowedRoles.includes(tokenPayload.role);

            if(!hasAccess) {
                throw new ForbiddenError("Користувач не має необхідних прав доступу");
            }

            next();
        }
}