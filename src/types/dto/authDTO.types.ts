import {z, type ZodObject} from "zod";
import {type LoginFormValues, loginFormValuesSchema, type UserRole} from "../models/user.ts";


//Тип для payload в jwt-токені
export interface TokenPayload {
    id: number;
    email: string;
    role: UserRole;
    iat?: number; // Issued At (timestamp)
    exp?: number; //Expiration Time (timestamp)
}

export type LoginRequest = LoginFormValues;
export const loginRequestSchema = loginFormValuesSchema;

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}
export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});

export interface RefreshAllTokensRequestDTO {
    refreshToken: string;
}
export const RefreshAllTokensRequestDTOSchema = z.object({
    refreshToken: z.string()
});

export interface RefreshAllTokensResponseDTO {
    accessToken: string;
    refreshToken: string;
}
export const RefreshAllTokensResponseDTOSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});