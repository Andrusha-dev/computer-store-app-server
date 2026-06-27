import {type Address, Prisma, type User} from "../../../../prisma/generated/client.ts";




//ОСНОВНІ БІЗНЕС ТИПИ
export type AddressEntity = Address;

export type UserEntity = User;

export const userInclude = {
    address: true,
    //Реляції cart та orders не потрібні, щоб не перевантажувати бд. В них є власні маршрути, якими і слід користуватись
} satisfies Prisma.UserInclude //або as const;
export type UserFullEntity = Prisma.UserGetPayload<{ include: typeof userInclude}>









