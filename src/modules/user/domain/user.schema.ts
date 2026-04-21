import {z} from "zod";
import {userRoleSchema} from "../../../shared/schemas/user-role.schema.ts";



//БАЗОВІ СХЕМИ
//Базова схема користувача
export const userSchema = z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string()
        .length(17, "Довжина номеру телефона має бути 17 символів")
        .regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, "Формат: +38(0XX)XXX-XX-XX"),
    birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
    profession: z.string(),
    isMarried: z.boolean(),
    role: userRoleSchema,
});

//Базова схема адреси користувача (реляція)
export const addressSchema = z.object({
    city: z.string(),
    street: z.string(),
    houseNumber: z.number().int(),
});