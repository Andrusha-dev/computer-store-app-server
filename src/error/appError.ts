import type {ErrorCode, ErrorResponse} from "../types/dto/error.dto.ts";


export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly details?: Record<string, any>;

    constructor(errorResponse: ErrorResponse) {
        super(errorResponse.message);
        this.name = 'AppError';
        this.code = errorResponse.code;
        this.statusCode = errorResponse.statusCode;
        this.details = errorResponse.details;

        // Необхідно для коректної роботи instanceof в TS/JS
        Object.setPrototypeOf(this, AppError.prototype);
    }
}