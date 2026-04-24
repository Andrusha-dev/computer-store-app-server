import type {AuthTokens} from "../domain/auth.types.ts";
import {type AuthResponse, authResponseSchema} from "./auth.dto.ts";




export const toAuthResponse = (authTokens: AuthTokens): AuthResponse => {
    const authResponse: AuthResponse = {
        accessToken: authTokens.accessToken,
        refreshToken: authTokens.refreshToken,
    }

    const validatedAuthResponse: AuthResponse = authResponseSchema.parse(authResponse);

    return validatedAuthResponse;
}