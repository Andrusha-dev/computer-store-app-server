import type {DeliveryResponse} from "../api/delivery.dto";
import {Prisma} from "../../../../prisma/generated/client";



export interface IDeliveryService {
    updateTrackingNumber: (id: number, trackingNumber: string, tx?: Prisma.TransactionClient) => Promise<DeliveryResponse>
}