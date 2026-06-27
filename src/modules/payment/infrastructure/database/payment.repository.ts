import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service";
import type {IPaymentRepository} from "../../domain/payment.repository.contract";
import type {PaymentEntity} from "../../domain/payment.entity";
import {Prisma} from "../../../../../prisma/generated/client";



interface Dependencies {
    dbService: PrismaService;
}

export class PaymentRepository implements IPaymentRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    update =
        async (id: number,data: Prisma.PaymentUpdateInput, tx?: Prisma.TransactionClient): Promise<PaymentEntity> => {
            const client = tx ?? this.dbService;

            const payment: PaymentEntity = await client.payment.update({
                where: {
                    id: id
                },
                data: data
            });

            return payment;
        }


    updateStatusByExternalId =
        async (externalId: string, data: Prisma.PaymentUpdateInput, tx?: Prisma.TransactionClient): Promise<PaymentEntity> => {
            const client = tx ?? this.dbService;

            const payment: PaymentEntity = await client.payment.update({
                where: {
                    externalId: externalId
                },
                data: data
            });

            return payment;
        }
}