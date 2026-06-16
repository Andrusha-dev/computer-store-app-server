import type {PaymentEntity} from "../domain/payment.entity.ts";
import {type PaymentResponse, paymentResponseSchema} from "./payment.dto.ts";



export const toPaymentResponse =
    (payment: PaymentEntity): PaymentResponse => {
        const transformedPayment = {
            ...payment
        }

        const response: PaymentResponse = paymentResponseSchema.parse(transformedPayment);

        return response;
    }