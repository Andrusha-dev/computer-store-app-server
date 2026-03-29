import jwt from "jsonwebtoken";
import {
    config,
} from "../../config/index.ts";
//import { IJwtProvider } from './jwt.contract.ts';
import {type TokenPayload, tokenPayloadSchema} from "../../shared/auth/auth.schema.ts";








/*

export class JwtProvider implements IJwtProvider {
    signAccess = (payload: Record<string, unknown>): string => {
        //Про всяк випадок вилучаємо iat і exp щоб спрацював expiresIn
        const { iat, exp, ...data } = payload;
        const accessToken = jwt.sign(data, ACCESS_TOKEN_SECRET, { expiresIn: "1m"});
        return accessToken;
    }

    // Генерація Refresh Token (2 хвилини)
    signRefresh = (payload: Record<string, unknown>): string => {
        //Про всяк випадок вилучаємо iat і exp щоб спрацював expiresIn
        const { iat, exp, ...data } = payload;
        const refreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, { expiresIn: "2m"});
        return refreshToken;
    }

    // Валідація Access Token
    verifyAccess = (token: string) => {
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }

    // Валідація Access Token
    verifyRefresh = (token: string) => {
        try {
            const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }

}
*/










export const jwtProvider = {
    // Генерація Access Token (1 хвилина)
    signAccess: (payload: TokenPayload): string => {
        const { iat, exp, ...data } = payload;
        const accessToken = jwt.sign(
            data,
            config.jwt.access.secret,
            { expiresIn: config.jwt.access.expiresIn }
        );
        return accessToken;
    },

    // Генерація Refresh Token (2 хвилини)
    signRefresh: (payload: TokenPayload): string => {
        const { iat, exp, ...data } = payload;
        const refreshToken = jwt.sign(
            data,
            config.jwt.refresh.secret,
            { expiresIn: config.jwt.refresh.expiresIn }
        );
        return refreshToken;
    },

    // Валідація Access Token
    verifyAccess: (token: string): TokenPayload | null => {
        try {
            const decoded = jwt.verify(token, config.jwt.access.secret);
            const tokenPayload: TokenPayload = tokenPayloadSchema.parse(decoded);
            return tokenPayload;
        } catch (error) {
            return null;
            //throw new UnauthorizedError("access токен недійсний чи некоректний");
        }
    },

    // Валідація Refresh Token
    verifyRefresh: (token: string): TokenPayload | null => {
        try {
            const decoded = jwt.verify(token, config.jwt.refresh.secret);
            const tokenPayload: TokenPayload = tokenPayloadSchema.parse(decoded);
            return tokenPayload;

        } catch (error) {
            return null;
            //throw new UnauthorizedError("refresh токен недійсний чи некоректний");
        }
    }
};

export type IJwtProvider = typeof jwtProvider;

