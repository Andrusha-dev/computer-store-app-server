import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service";
import type {IDeliveryRepository} from "../../domain/delivery.repository.contract";
import type {DeliveryEntity} from "../../domain/delivery.entity";
import {Prisma} from "../../../../../prisma/generated/client";


interface Dependencies {
    dbService: PrismaService;
}

export class DeliveryRepository implements IDeliveryRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    update =
        async (id: number, data: Prisma.DeliveryUpdateInput, tx?: Prisma.TransactionClient): Promise<DeliveryEntity> => {
            const client = tx ?? this.dbService;

            const delivery: DeliveryEntity = await client.delivery.update({
                where: {
                    id: id
                },
                data: data
            });

            return delivery;
        }
}