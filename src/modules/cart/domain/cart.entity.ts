import {type Cart, type CartItem, Prisma} from "../../../../prisma/generated/client.ts";




export type CartItemEntity = CartItem;

export type CartEntity = Cart;

export const cartInclude = {
    //реляція user для cart, зазвичай не потрібна, а якщо раптом знадобиться то user можна отримати через id cart, або з tokenPayload
    //реляція items для cart повинна підтягувати власну реляцію product. Це критично важливо для фронтенда
    items: {
        include: {
            product: true,
        }
    },
} satisfies Prisma.CartInclude;
export type CartFullEntity = Prisma.CartGetPayload<{include: typeof cartInclude}>