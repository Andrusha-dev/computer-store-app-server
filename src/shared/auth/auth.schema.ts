import {z} from "zod";


//Тип для ролей користувача
export const userRoleSchema = z.enum(["guest", "user", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>


//Тип для payload в jwt-токені
export const tokenPayloadSchema = z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    role: userRoleSchema,
    iat: z.number().positive().optional(),
    exp: z.number().positive().optional()
});
export interface TokenPayload extends z.infer<typeof tokenPayloadSchema>{}





