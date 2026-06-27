import type {CreatePaymentDto} from "../api/payment.dto";
import {Prisma} from "../../../../prisma/generated/client";




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