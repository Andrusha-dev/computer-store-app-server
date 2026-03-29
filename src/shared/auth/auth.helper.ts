import type {UserRole} from "./auth.schema.ts";
import {ForbiddenError} from "../../core/errors/custom.errors.ts";




//чистий хелпер для перевірки відповідності ролі користувача
export const checkAccess = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
    const hasAccess: boolean = allowedRoles.includes(userRole);
    return hasAccess;
}

//Хелпер з генерацією помилки для перевірки відповідності ролі користувача
export const ensureAccess = (userRole: UserRole, allowedRoles: UserRole[]): void => {
    const hasAccess: boolean = checkAccess(userRole, allowedRoles);
    if(!hasAccess) {
        throw new ForbiddenError("Користувач не має необхідних прав доступу");
    }
}