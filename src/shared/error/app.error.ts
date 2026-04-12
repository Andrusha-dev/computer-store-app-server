import type {ErrorCode, ErrorPayload} from "./error.types.ts";


export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly details?: Record<string, any>;

    constructor(errorPayload: ErrorPayload) {
        super(errorPayload.message);
        this.name = 'AppError';
        this.code = errorPayload.code;
        this.statusCode = errorPayload.statusCode;
        this.details = errorPayload.details;

        // Необхідно для коректної роботи instanceof в TS/JS
        Object.setPrototypeOf(this, AppError.prototype);
    }

    // Геттер, який автоматично збирає об'єкт ErrorResponse
    public get errorPayload(): ErrorPayload {
        return {
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            details: this.details
        };
    }

    //Метод, необхідний для парсинга в JSON обєкта AppError. Без нього парсинг може може бути з помилками
    public toJSON(): ErrorPayload {
        return this.errorPayload; // Просто використовуємо вже готовий геттер
    }
}