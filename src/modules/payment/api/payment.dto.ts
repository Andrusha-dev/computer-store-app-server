import {z} from "zod";




//БАЗОВІ СХЕМИ (БУДІВЕЛЬНІ БЛОКИ)
//Схема для статусів оплати
export const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"] as const;
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

//Схема для методів оплати
export const PAYMENT_METHODS = ["CARD", "CASH"] as const;
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

//Схема для провайдерів (банків, платіжних систем)
export const PAYMENT_PROVIDERS = ["MONOBANK", "LIQPAY", "INTERNAL"] as const;
export const paymentProviderSchema = z.enum(PAYMENT_PROVIDERS);
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;

//Основна схема оплати (Payment)
export const paymentSchema = z.object({
    id: z.number().int().positive(),
    status: paymentStatusSchema.default("PENDING"),
    method: paymentMethodSchema,
    amount: z.coerce.number().positive(),
    provider: paymentProviderSchema,
    externalId: z.string().nullable(),

    orderId: z.number().int().positive()
});


//INPUT
export const createPaymentDtoSchema = paymentSchema.pick({method: true});
export type CreatePaymentDto = z.infer<typeof createPaymentDtoSchema>;

//Тип вхідних даних для вебхука монобанку
export const monobankWebhookDtoSchema = z.object({
    invoiceId: z.string(),
    status: z.string(),
});
export type MonobankWebhookDto = z.infer<typeof monobankWebhookDtoSchema>;


//OUTPUT
export const paymentResponseSchema = paymentSchema;
export type PaymentResponse = z.infer<typeof paymentResponseSchema>;

//Схема відповіді з даними про invoice (обєкт PaymentResponse та url оплати);
export const createInvoiceResponseSchema = z.object({
    payment: paymentResponseSchema,
    paymentUrl: z.url()
});
export type CreateInvoiceResponse = z.infer<typeof createInvoiceResponseSchema>;