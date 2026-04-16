import type {TokenPayload} from "../schemas/token-payload.schema.ts";




export interface IJwtProvider {
    // Тепер sign теж generic! Він приймає T, який розширює базовий Payload
    signAccess: (payload: TokenPayload) => string;
    signRefresh: (payload: TokenPayload) => string;

    verifyAccess: (token: string) => TokenPayload | null;
    verifyRefresh: (token: string) => TokenPayload | null;
}