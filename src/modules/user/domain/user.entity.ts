//import {type Address, Prisma, type User} from "@prisma/client";
import {z} from "zod";
import {type addressSchema, userSchema} from "./user.schema.ts";




//ОСНОВНІ БІЗНЕС ТИПИ
//Сутність Address
export interface AddressEntity extends z.infer<typeof addressSchema> {}

//Сутність User без реляцій
export interface UserEntity extends z.infer<typeof userSchema> {}

//Сутність User з реляціями
export interface UserFull extends UserEntity {
    address: AddressEntity | null;
}





/*
//ОСНОВНІ БІЗНЕС ТИПИ
export type AddressEntity = Address;

export type UserEntity = User;

export const userFullInclude = {
    address: true,
} satisfies Prisma.UserInclude //або as const;
export type UserFull = Prisma.UserGetPayload<{ include: typeof userFullInclude}>
*/




