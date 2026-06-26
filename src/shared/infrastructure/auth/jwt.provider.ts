import jwt from "jsonwebtoken";
import {type Config} from "../config/index.ts";
import type {IJwtProvider} from "../../contracts/jwt.contract.ts";
import {type TokenPayload, tokenPayloadSchema} from "../../schemas/token-payload.schema.ts";



interface Dependencies {
    config: Config;
}

export class JwtProvider implements IJwtProvider {
    private readonly config: Config;

    constructor({config}: Dependencies) {
        this.config = config;
    }


    // Генерація Access Token (1 хвилина)
    signAccess = (payload: TokenPayload): string => {
        //Про всяк випадок вилучаємо iat і exp щоб спрацював expiresIn
        const { iat, exp, ...data } = payload;
        const accessToken = jwt.sign(
            data,
            this.config.jwt.access.secret,
            { expiresIn: this.config.jwt.access.expiresIn }
        );
        return accessToken;
    }

    // Генерація Refresh Token (2 хвилини)
    signRefresh = (payload: TokenPayload): string => {
        //Про всяк випадок вилучаємо iat і exp щоб спрацював expiresIn
        const { iat, exp, ...data } = payload;
        const refreshToken = jwt.sign(
            data,
            this.config.jwt.refresh.secret,
            { expiresIn: this.config.jwt.refresh.expiresIn }
        );
        return refreshToken;
    }

    // Валідація Access Token
    verifyAccess = (token: string): TokenPayload | null => {
        try {
            const decoded = jwt.verify(token, this.config.jwt.access.secret);
            const tokenPayload: TokenPayload = tokenPayloadSchema.parse(decoded);
            return tokenPayload;
        } catch (error) {
            return null;
            //throw new UnauthorizedError("access токен недійсний чи некоректний");
        }
    }

    // Валідація Refresh Token
    verifyRefresh = (token: string): TokenPayload | null => {
        try {
            const decoded = jwt.verify(token, this.config.jwt.refresh.secret);
            const tokenPayload: TokenPayload = tokenPayloadSchema.parse(decoded);
            return tokenPayload;

        } catch (error) {
            return null;
            //throw new UnauthorizedError("refresh токен недійсний чи некоректний");
        }
    }
}


