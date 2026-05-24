import type {OrderFullEntity} from "./order.entity.ts";
import {type OrderStatus, Prisma} from "@prisma/client";


export interface IOrderRepository {
    findFullById: (id: number) => Promise<OrderFullEntity | null>;
    findMany: (args: Prisma.OrderFindManyArgs) => Promise<OrderFullEntity[]>;
    count: (where?: Prisma.OrderWhereInput) => Promise<number>;
    create: (data: Prisma.OrderCreateInput) => Promise<OrderFullEntity>;
    updateStatus: (id: number, status: OrderStatus) => Promise<OrderFullEntity>
}