import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import type {IOrderRepository} from "../../domain/order.repository.contract.ts";
import {type OrderFullEntity, orderInclude} from "../../domain/order.entity.ts";
import {Prisma} from "@prisma/client";



interface Dependencies {
    dbService: PrismaService
}

export class OrderRepository implements IOrderRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findFullById =
        async (id: number): Promise<OrderFullEntity | null> => {
            const order: OrderFullEntity | null = await this.dbService.order.findUnique({
                where: {id: id},
                include: orderInclude
            });

            return order;
        }

    findMany =
        async (args: Prisma.OrderFindManyArgs): Promise<OrderFullEntity[]> => {
            const orders: OrderFullEntity[] = await this.dbService.order.findMany({
                ...args,
                //include є обовязковим, бо тип OrderFullEntity цього вимагає
                include: orderInclude
            });

            return orders;
        }

    count =
        async (where?: Prisma.OrderWhereInput): Promise<number> => {
            const count: number = await this.dbService.order.count({where: where});

            return count;
        }

    create =
        async (data: Prisma.OrderCreateInput, tx?: Prisma.TransactionClient): Promise<OrderFullEntity> => {
            const client = tx ?? this.dbService;

            const order: OrderFullEntity = await client.order.create({
                data: data,
                include: orderInclude
            });

            return order;
        }

    update =
        async (id: number, data: Prisma.OrderUpdateInput, tx?: Prisma.TransactionClient): Promise<OrderFullEntity> => {
            const client = tx ?? this.dbService;

            const order: OrderFullEntity = await client.order.update({
                where: {id: id},
                data: data,
                include: orderInclude
            });

            return order;
        }
}