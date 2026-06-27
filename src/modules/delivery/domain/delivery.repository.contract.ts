import type {DeliveryEntity} from "./delivery.entity";
import {Prisma} from "../../../../prisma/generated/client";




export interface IDeliveryRepository {
    update: (id: number, data: Prisma.DeliveryUpdateInput, tx?: Prisma.TransactionClient) => Promise<DeliveryEntity>
}