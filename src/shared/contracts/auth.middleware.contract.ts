import type {RequestHandler} from "express";
import type {UserRole} from "../schemas/user-role.schema.ts";




//Типізація AuthMiddleware
export interface IAuthMiddleware {
    // Перевірка токена
    //RequestHandler - це загальний тип для функцій middleware
    authenticate: RequestHandler;
    // Перевірка прав (повертає мідлвару)
    authorize(allowedRoles: UserRole[]): RequestHandler;
}



