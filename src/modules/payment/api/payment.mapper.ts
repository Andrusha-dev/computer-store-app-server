import type {PaymentEntity} from "../domain/payment.entity";
import {type PaymentResponse, paymentResponseSchema} from "./payment.dto";



export const toPaymentResponse =
    (payment: PaymentEntity): PaymentResponse => {
        const transformedPayment = {
            ...payment
        }

        const response: PaymentResponse = paymentResponseSchema.parse(transformedPayment);

        return response;
    }