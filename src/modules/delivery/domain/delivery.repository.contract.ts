import type {DeliveryEntity} from "./delivery.entity.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";




export interface IDeliveryRepository {
    update: (id: number, data: Prisma.DeliveryUpdateInput, tx?: Prisma.TransactionClient) => Promise<DeliveryEntity>
}