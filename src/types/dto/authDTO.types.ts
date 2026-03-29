import {z} from "zod";
import {baseUserSchema} from "../../modules/user/user.schema.ts";
//import {baseUserSchema} from "../models/custom/user.model.ts";




//Тип для payload в jwt-токені
export const tokenPayloadSchema = baseUserSchema
    .pick({id: true, email: true, role: true})
    .extend({
        iat: z.number().positive().optional(),
        exp: z.number().positive().optional()
    });
export interface TokenPayload extends z.infer<typeof tokenPayloadSchema>{}


export const loginRequestSchema = z.object({
    email: z.email("Невірний формат пошти"),
    password: z.string().min(8, "Довжина паролю має бути не менше 8 символів"), // Тут не обов'язково .min(8), бо ми просто перевіряємо те, що ввів юзер
});
export interface LoginRequest extends z.infer<typeof loginRequestSchema>{}


export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});
export interface LoginResponse extends z.infer<typeof loginResponseSchema>{}

export const refreshAllTokensRequestSchema = z.object({
    refreshToken: z.string()
});
export interface RefreshAllTokensRequest extends z.infer<typeof refreshAllTokensRequestSchema>{}

export const refreshAllTokensResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});
export interface RefreshAllTokensResponse extends z.infer<typeof refreshAllTokensResponseSchema>{}