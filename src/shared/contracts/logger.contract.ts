

export interface ILoggerService {
    debug: (message: string, context?: object) => void;
    info: (message: string, context?: object) => void;
    warn: (message: string, context?: object) => void;
    error: (message: string, error?: unknown, context?: object) => void;
}