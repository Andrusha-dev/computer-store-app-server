import type {RequestHandler} from "express";
import type {UserRole} from "./auth.schema.ts";




//Типізація AuthMiddleware
export interface IAuthMiddleware {
    // Перевірка токена
    //RequestHandler - це загальний тип для функцій middleware
    authenticate: RequestHandler;
    // Перевірка прав (повертає мідлвару)
    authorize(allowedRoles: UserRole[]): RequestHandler;
}



