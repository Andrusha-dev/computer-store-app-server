import type {OrderFullEntity} from "./order.entity.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";
//import {Prisma} from "@prisma/client";


export interface IOrderRepository {
    findFullById: (id: number) => Promise<OrderFullEntity | null>;
    findMany: (args: Prisma.OrderFindManyArgs) => Promise<OrderFullEntity[]>;
    count: (where?: Prisma.OrderWhereInput) => Promise<number>;
    create: (data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient) => Promise<OrderFullEntity>;
    update: (id: number, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient) => Promise<OrderFullEntity>
}