import {AppError} from "./app.error.ts";




// 400 - Bad Request
export class BadRequestError extends AppError {
    constructor(message: string = 'Некоректний запит', details?: Record<string, any>) {
        super({
            message,
            code: 'BAD_REQUEST',
            statusCode: 400,
            details
        });
    }
}

// 401 - Unauthorized
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Користувач не авторизований') {
        super({
            message,
            code: 'UNAUTHORIZED',
            statusCode: 401,
        });
    }
}

// 403 - Forbidden
export class ForbiddenError extends AppError {
    constructor(message: string = 'Доступ заборонено') {
        super({
            message,
            code: 'FORBIDDEN',
            statusCode: 403,
        });
    }
}

// 404 - Not Found
export class NotFoundError extends AppError {
    constructor(message: string = 'Ресурс не знайдено') {
        super({
            message,
            code: 'NOT_FOUND',
            statusCode: 404,
        });
    }
}

// 409 - Conflict
export class ConflictError extends AppError {
    constructor(field: string, details?: Record<string, any>) {
        super({
            message: `Запис із таким значенням для поля ${field} вже існує`,
            code: 'CONFLICT',
            statusCode: 409,
            details
        });
    }
}

export class ValidationError extends AppError {
    constructor(details?: Record<string, any>, message: string = "помилка валідації даних", ) {
        super({
            message,
            code: 'VALIDATION_ERROR',
            statusCode: 422,
            details
        });
    }
}




// 500 - Internal Server Error
export class InternalServerError extends AppError {
    constructor(message: string = 'Внутрішня помилка сервера') {
        super({
            message,
            code: 'INTERNAL_SERVER_ERROR',
            statusCode: 500,
        });
    }
}