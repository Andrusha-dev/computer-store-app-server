import {type Order, type OrderItem, Prisma} from "@prisma/client";


export type OrderItemEntity = OrderItem;

export type OrderEntity = Order;

//Реляції сутності Order
export const orderInclude = {
    items: {
        include: {
            product: true
        }
    },
} satisfies Prisma.OrderInclude;
//Сутність Order з реляціями
export type OrderFullEntity = Prisma.OrderGetPayload<{include: typeof orderInclude}>;