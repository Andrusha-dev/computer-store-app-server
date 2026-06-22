import type {CreateInvoiceResponse, PaymentResponse, PaymentStatus} from "../api/payment.dto.ts";



export interface IPaymentService {
    createInvoice: (orderId: number, paymentId: number, amount: number) => Promise<CreateInvoiceResponse>;
    updateStatusByExternalId: (externalId: string, status: Extract<PaymentStatus, "PAID" | "FAILED" | "REFUNDED">) => Promise<PaymentResponse>
}