export type ErrorCode = 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_SERVER_ERROR' | 'BAD_GATEWAY_ERROR';

export interface ErrorPayload {
    message: string;
    code: ErrorCode;
    statusCode: number;
    details?: Record<string, any>;
}