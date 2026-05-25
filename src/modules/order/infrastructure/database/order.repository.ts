import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import type {IOrderRepository} from "../../domain/order.repository.contract.ts";
import {type OrderFullEntity, orderInclude} from "../../domain/order.entity.ts";
import {type OrderStatus, Prisma} from "@prisma/client";



interface Dependencies {
    dbService: PrismaService
}

export class OrderRepository implements IOrderRepository{
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
        async (data: Prisma.OrderCreateInput): Promise<OrderFullEntity> => {
            const order: OrderFullEntity = await this.dbService.order.create({
                data: data,
                include: orderInclude
            });

            return order;
        }

    updateStatus =
        async (id: number, status: OrderStatus): Promise<OrderFullEntity> => {
            const order: OrderFullEntity = await this.dbService.order.update({
                where: {id: id},
                data: {status: status},
                include: orderInclude
            });

            return order;
        }
}