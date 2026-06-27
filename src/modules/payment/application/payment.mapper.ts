import type {CreatePaymentDto} from "../api/payment.dto.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";




export const toPaymentCreateWithoutOrderInput =
    (totalAmount: number, dto: CreatePaymentDto): Prisma.PaymentCreateWithoutOrderInput => {
        const data: Prisma.PaymentCreateWithoutOrderInput = {
            amount: totalAmount,
            status: "PENDING",
            method: dto.method,
            provider: dto.method === "CARD" ? "MONOBANK" : "INTERNAL"
        }

        return data;
    }