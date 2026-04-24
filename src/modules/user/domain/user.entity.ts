import {type Address, Prisma, type User} from "@prisma/client";






//ОСНОВНІ БІЗНЕС ТИПИ
export type AddressEntity = Address;

export type UserEntity = User;

export const userFullInclude = {
    address: true,
} satisfies Prisma.UserInclude //або as const;
export type UserFull = Prisma.UserGetPayload<{ include: typeof userFullInclude}>









