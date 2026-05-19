import {type Cart, Prisma} from "@prisma/client";


export type CartEntity = Cart;

export const cartInclude = {
    user: true,
    items: true,
} satisfies Prisma.CartInclude;
export type CartFullEntity = Prisma.CartGetPayload<{include: typeof cartInclude}>