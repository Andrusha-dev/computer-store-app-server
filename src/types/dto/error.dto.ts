export type ErrorCode = 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_SERVER_ERROR';

export interface ErrorResponse {
    message: string;
    code: ErrorCode;
    statusCode: number;
    details?: Record<string, any>;
}