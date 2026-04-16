//import {z} from "zod";
//import {baseAddressSchema, baseUserSchema} from "../user.schema.ts";
import type {UserRole} from "../../../shared/schemas/user-role.schema.ts";
import {type Address, Prisma, type User} from "@prisma/client";





//ОСНОВНІ БІЗНЕС ТИПИ
export type AddressEntity = Address;

export type UserEntity = User;

export const userFullInclude = {
    address: true,
} satisfies Prisma.UserInclude //або as const;
export type UserFull = Prisma.UserGetPayload<{ include: typeof userFullInclude}>


//БІЗНЕС ТИП ДЛЯ ПОВЕРНЕННЯ СЕРВІСУ AuthService
export interface AuthenticatedUser {
    id: number;
    email: string;
    role: UserRole;
}


/*
//БІЗНЕС СУТНОСТІ
//Бізнес тип для реляції address
export const addressEntitySchema = baseAddressSchema;
export interface AddressEntity extends z.infer<typeof addressEntitySchema>{}

// Універсальний бізнес тип без реляцій (Чиста, без пароля)
export const userEntitySchema = baseUserSchema.omit({ password: true });
export interface UserEntity extends z.infer<typeof userEntitySchema>{}

//Універсальний бізнес тип з опціональними реляціями
export const userFullSchema = userEntitySchema.extend({
    address: addressEntitySchema.nullish(),
    //orders: z.array(orderEntitySchema).optional(),
});
export interface UserFull extends z.infer<typeof userFullSchema>{}


// ТЕХНІЧНИЙ ТИП для Auth (Internal Only)
// Ми просто беремо baseUserSchema, де пароль ЩЕ Є
export const userAuthSchema = baseUserSchema
export interface UserAuth extends z.infer<typeof userAuthSchema> {}


//БІЗНЕС ТИП ДЛЯ ПОВЕРНЕННЯ СЕРВІСУ AuthService
export interface AuthenticatedUser {
    id: number;
    email: string;
    role: UserRole;
}
*/





