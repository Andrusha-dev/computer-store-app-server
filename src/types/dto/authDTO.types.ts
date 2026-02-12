import {z, type ZodObject} from "zod";
import {baseUserSchema, type UserRole} from "../models/custom/user.model.ts";
import jwt from "jsonwebtoken";



//Тип для payload в jwt-токені
export const tokenPayloadSchema = baseUserSchema
    .pick({id: true, email: true, role: true})
    .extend({
        iat: z.number().int().positive().optional(),
        exp: z.number().int().positive().optional()
    });
export type TokenPayload = z.infer<typeof tokenPayloadSchema>


export const loginRequestSchema = baseUserSchema.pick({ email: true, password: true });
export type LoginRequest = z.infer<typeof loginRequestSchema>;


export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});
export type LoginResponse = z.infer<typeof loginResponseSchema>

export const refreshAllTokensRequestSchema = z.object({
    refreshToken: z.string()
});
export type RefreshAllTokensRequest = z.infer<typeof refreshAllTokensRequestSchema>

export const refreshAllTokensResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string()
});
export type RefreshAllTokensResponse = z.infer<typeof refreshAllTokensResponseSchema>