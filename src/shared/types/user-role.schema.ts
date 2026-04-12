import {z} from "zod";


//Тип для ролей користувача
export const userRoleSchema = z.enum(["guest", "user", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>