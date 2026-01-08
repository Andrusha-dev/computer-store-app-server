import {z} from "zod";

export interface Address {
    city: string;
    street: string;
    houseNumber: number
}
export const addressSchema = z.object({
    city: z.string(),
    street: z.string(),
    houseNumber: z.number().int().positive()
});

export type UserRole = "guest" | "user" | "admin";
export const userRoleSchema = z.enum(["guest", "user", "admin"]);

export interface User {
    id: number;
    email: string;
    password: string;
    username: string;
    firstname: string;
    lastname: string;
    address: Address;
    phone: string;
    birthYear: number;
    profession: string;
    isMarried: boolean;
    role: UserRole;
}
export const userSchema = z.object({
    id: z.number(),
    email: z.email(),
    password: z.string().min(8, "Довжина паролю має бути не менше 8 символів"),
    username: z.string().min(6, "Довжина імені користувача має бути не менше 6 символів"),
    firstname: z.string(),
    lastname: z.string(),
    address: addressSchema,
    phone: z.string().length(17, "Довжина номеру телефона має бути не меншу 17 символів")
        .regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, "Номер телефону не відповідає формату +38(0XX)XXX-XX-XX"),
    birthYear: z.number().int().positive().min(1900, "Рік народження має бути не меншим ніж 1900"),
    profession: z.string(),
    isMarried: z.boolean(),
    role: userRoleSchema
})


//Тип для способу сортування користувачів
export type UserSortType = keyof Pick<User, "firstname" | "lastname">;
export const userSortTypeSchema = z.enum(["firstname", "lastname"])

//Тип, який використовується клієнтом під час реєстрації нового користувача
export type MultiStepFormValues = Omit<User, "id" | "role">;
export const multistepFormValuesSchema = userSchema.omit({id: true, role: true});

//Тип для типізації даних форми автентифікації. використовується під час автентифікації користувача
export type LoginFormValues = Pick<User, "email" | "password">;
export const loginFormValuesSchema = userSchema.pick({email: true, password: true});

//Тип, який використовує сервер після реєстрації нового користувача і може повертати клієнту
export type UserWithoutPassword = Omit<User, "password">;
export const userWithoutPasswordSchema = userSchema.omit({password: true});