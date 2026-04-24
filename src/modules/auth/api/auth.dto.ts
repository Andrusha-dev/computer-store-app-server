import {z} from "zod";



//INPUT
export const loginDtoSchema = z.object({
    email: z.string().email("Невірний формат пошти"),
    password: z.string().min(8, "Довжина паролю має бути не менше 8 символів")
});
export interface LoginDto extends z.infer<typeof loginDtoSchema>{}

export const refreshAllTokensDtoSchema = z.object({
    refreshToken: z.string()
});
export interface RefreshAllTokensDto extends z.infer<typeof refreshAllTokensDtoSchema>{}



//OUTPUT
export const authResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});
export interface AuthResponse extends z.infer<typeof authResponseSchema>{}