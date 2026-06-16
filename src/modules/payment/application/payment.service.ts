import type {IPaymentRepository} from "../domain/payment.repository.contract.ts";
import type {IOrderService} from "../../order/application/order.service.contract.ts";
import type {IPaymentService} from "../domain/payment.service.contract.ts";
import type {PaymentEntity} from "../domain/payment.entity.ts";
import {Prisma} from "@prisma/client";
import {toPaymentResponse} from "../api/payment.mapper.ts";
import type {CreateInvoiceResponse, PaymentResponse, PaymentStatus} from "../api/payment.dto.ts";
import type {CreateInvoiceOutput, IPaymentProvider} from "../domain/payment.provider.contract.ts";
import {BadGatewayError} from "../../../shared/error/custom.errors.ts";



interface Dependencies {
    paymentRepository: IPaymentRepository;
    paymentProvider: IPaymentProvider;
    orderService: IOrderService
}

export class PaymentService implements IPaymentService {
    private readonly paymentRepository: IPaymentRepository;
    private readonly paymentProvider: IPaymentProvider;
    private readonly orderService: IOrderService;

    constructor({paymentRepository, paymentProvider, orderService}: Dependencies) {
        this.paymentRepository = paymentRepository;
        this.paymentProvider = paymentProvider;
        this.orderService = orderService;
    }

    createInvoice =
        async (orderId: number, paymentId: number, amount: number): Promise<CreateInvoiceResponse> => {
            let invoice: CreateInvoiceOutput;

            try {
                //Стукаємо в Монобанк за лінком
                invoice = await this.paymentProvider.createInvoice({
                    orderId: orderId,
                    amount: amount,
                });
            } catch (error) {
                throw new BadGatewayError("Платіжна система тимчасово недоступна. Спробуйте виконати оплату ще раз за кілька хвилин");
            }

            //Оновлюємо поле externalId
            const data: Prisma.PaymentUpdateInput = { externalId: invoice.invoiceId };
            const payment: PaymentEntity = await this.paymentRepository.update(paymentId, data);

            console.log(`[PAYMENT_SERVICE] Отримано інвойс ${invoice.invoiceId} від банку та оновлено платіж ID ${paymentId}`);

            const paymentResponse: PaymentResponse = toPaymentResponse(payment);
            //Повертаємо дані платежу разом із посиланням на оплату
            const response: CreateInvoiceResponse = {
                payment: paymentResponse,
                paymentUrl: invoice.pageUrl
            };

            return response;
        }

    /*
    updateExternalId =
        async (id: number, externalId: string): Promise<PaymentResponse> => {
            const data: Prisma.PaymentUpdateInput = {externalId: externalId}

            const payment: PaymentEntity = await this.paymentRepository.update(id, data);
            console.log(`[PAYMENT_SERVICE] Збережено externalId ${externalId} для платежу з ID${id}`);

            const response: PaymentResponse = toPaymentResponse(payment);

            return response;
        }
    */

    //Оновлення статусів Order та Payment (Викликається вебхуком монобанку)
    updateStatusByExternalId =
        async (externalId: string, status: Extract<PaymentStatus, "PAID" | "FAILED">): Promise<PaymentResponse> => {
            const data: Prisma.PaymentUpdateInput = {status: status}

            //Оновлюємо статус самого платежу в модулі payment
            const payment: PaymentEntity = await this.paymentRepository.updateStatusByExternalId(externalId, data);
            console.log(`[PAYMENT_SERVICE] Статус платежу з externalId ${externalId} змінено на: ${status}`);

            //Якщо оплата успішна — міняємо статус замовлення в модулі order
            if(status === "PAID") {
                await this.orderService.updateStatus(payment.orderId, {status: status});
                console.log(`[PAYMENT_SERVICE] Надіслано запит в OrderService для оновлення статусу замовлення з ID${payment.orderId}`);
            }

            const response: PaymentResponse = toPaymentResponse(payment);

            return response;
        }
}