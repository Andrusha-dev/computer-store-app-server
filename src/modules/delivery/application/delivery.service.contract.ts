import type {DeliveryResponse} from "../api/delivery.dto.ts";
import {Prisma} from "@prisma/client";


export interface IDeliveryService {
    updateTrackingNumber: (id: number, trackingNumber: string, tx?: Prisma.TransactionClient) => Promise<DeliveryResponse>
}