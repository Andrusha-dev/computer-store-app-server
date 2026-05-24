import {type Order, Prisma} from "@prisma/client";



export type OrderEntity = Order;

export const orderInclude = {
    items: {
        include: {
            product: true
        }
    },
} satisfies Prisma.OrderInclude;
export type OrderFullEntity = Prisma.OrderGetPayload<{include: typeof orderInclude}>;