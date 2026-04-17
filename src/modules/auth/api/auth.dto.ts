import {z} from "zod";




export const loginDtoSchema = z.object({
    email: z.string().email("Невірний формат пошти"),
    password: z.string().min(8, "Довжина паролю має бути не менше 8 символів")
});
export interface LoginDto extends z.infer<typeof loginDtoSchema>{}

export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});
export interface LoginResponse extends z.infer<typeof loginResponseSchema>{}




export const refreshAllTokensDtoSchema = z.object({
    refreshToken: z.string()
});
export interface RefreshAllTokensDto extends z.infer<typeof refreshAllTokensDtoSchema>{}

export const refreshAllTokensResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});
export interface RefreshAllTokensResponse extends z.infer<typeof refreshAllTokensResponseSchema>{}