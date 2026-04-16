import {z} from "zod";
import {userRoleSchema} from "./user-role.schema.ts";




//Тип для payload в jwt-токені
export const tokenPayloadSchema = z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    role: userRoleSchema,
    iat: z.number().positive().optional(),
    exp: z.number().positive().optional()
});
export interface TokenPayload extends z.infer<typeof tokenPayloadSchema>{}