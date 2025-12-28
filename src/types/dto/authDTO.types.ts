import {z, type ZodObject} from "zod";

export interface LoginRequestDTO {
    email: string;
    password: string;
}
export const LoginRequestDTOSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});

export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
}
export const LoginResponseDTOSchema = z.object({
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