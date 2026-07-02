

export interface CreateInvoiceInput {
    orderId: number;
    amount: number;
}

export interface CreateInvoiceOutput {
    invoiceId: string; // externalId від банку
    pageUrl: string;   // Лінк на оплату
}

export interface IPaymentProvider {
    createInvoice: (input: CreateInvoiceInput) => Promise<CreateInvoiceOutput>;
    verifyWebhookSignature: (rawBody: Buffer, xSign: string) => boolean;
}