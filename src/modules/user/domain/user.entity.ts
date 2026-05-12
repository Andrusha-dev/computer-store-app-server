import {type Address, Prisma, type User} from "@prisma/client";






//ОСНОВНІ БІЗНЕС ТИПИ
export type AddressEntity = Address;

export type UserEntity = User;

export const userInclude = {
    address: true,
} satisfies Prisma.UserInclude //або as const;
export type UserFullEntity = Prisma.UserGetPayload<{ include: typeof userInclude}>









