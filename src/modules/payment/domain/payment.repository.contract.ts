import type {PaymentEntity} from "./payment.entity";
import {Prisma} from "../../../../prisma/generated/client";


export interface IPaymentRepository {
    update: (id: number, data: Prisma.PaymentUpdateInput, tx?: Prisma.TransactionClient) => Promise<PaymentEntity>;
    updateStatusByExternalId: (externalId: string, data: Prisma.PaymentUpdateInput, tx?: Prisma.TransactionClient) => Promise<PaymentEntity>;
}