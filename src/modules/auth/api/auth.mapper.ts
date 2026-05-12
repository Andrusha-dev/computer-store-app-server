import {type AuthResponse, authResponseSchema} from "./auth.dto.ts";




export const toAuthResponse = (accessToken: string, refreshToken: string): AuthResponse => {
    const response: AuthResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
    }

    const validatedResponse: AuthResponse = authResponseSchema.parse(response);

    return validatedResponse;
}