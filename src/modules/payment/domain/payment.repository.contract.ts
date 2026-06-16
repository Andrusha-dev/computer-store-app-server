import {Prisma} from "@prisma/client";
import type {PaymentEntity} from "./payment.entity.ts";


export interface IPaymentRepository {
    update: (id: number, data: Prisma.PaymentUpdateInput, tx?: Prisma.TransactionClient) => Promise<PaymentEntity>;
    updateStatusByExternalId: (externalId: string, data: Prisma.PaymentUpdateInput, tx?: Prisma.TransactionClient) => Promise<PaymentEntity>;
}