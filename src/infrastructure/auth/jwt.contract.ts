import type {JwtPayload} from "jwt-decode";

export interface IJwtProvider {
    // Тепер sign теж generic! Він приймає T, який розширює базовий Payload
    signAccess: (payload: Record<string, unknown>) => string;
    signRefresh: (payload: Record<string, unknown>) => string;

    verifyAccess: (token: string) => string | JwtPayload | null;
    verifyRefresh: (token: string) => string | JwtPayload | null;
}