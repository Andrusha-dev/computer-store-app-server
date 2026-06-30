import type {CreateInvoiceResponse, MonobankWebhookDto} from "../api/payment.dto";



export interface IPaymentService {
    createInvoice: (orderId: number, paymentId: number, amount: number) => Promise<CreateInvoiceResponse>;
    //updateStatusByExternalId: (externalId: string, status: Extract<PaymentStatus, "PAID" | "FAILED" | "REFUNDED">) => Promise<PaymentResponse>
    processMonobankWebhook: (dto: MonobankWebhookDto) => Promise<void>
}