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
    private readonly deps: Dependencies;

    constructor(dependencies: Dependencies) {
        this.deps = dependencies;
    }

    createInvoice =
        async (orderId: number, paymentId: number, amount: number): Promise<CreateInvoiceResponse> => {
            let invoice: CreateInvoiceOutput;

            try {
                //Стукаємо в Монобанк за лінком
                invoice = await this.deps.paymentProvider.createInvoice({
                    orderId: orderId,
                    amount: amount,
                });
            } catch (error) {
                throw new BadGatewayError("Платіжна система тимчасово недоступна. Спробуйте виконати оплату ще раз за кілька хвилин");
            }

            //Оновлюємо поле externalId
            const data: Prisma.PaymentUpdateInput = { externalId: invoice.invoiceId };
            const payment: PaymentEntity = await this.deps.paymentRepository.update(paymentId, data);

            console.log(`[PAYMENT_SERVICE] Отримано інвойс ${invoice.invoiceId} від банку та оновлено платіж ID ${paymentId}`);

            const paymentResponse: PaymentResponse = toPaymentResponse(payment);
            //Повертаємо дані платежу разом із посиланням на оплату
            const response: CreateInvoiceResponse = {
                payment: paymentResponse,
                paymentUrl: invoice.pageUrl
            };

            return response;
        }

    //Оновлення статусів Order та Payment (Викликається вебхуком монобанку)
    updateStatusByExternalId =
        async (externalId: string, status: Extract<PaymentStatus, "PAID" | "FAILED">): Promise<PaymentResponse> => {
            const data: Prisma.PaymentUpdateInput = {status: status}

            //Оновлюємо статус самого платежу в модулі payment
            const payment: PaymentEntity = await this.deps.paymentRepository.updateStatusByExternalId(externalId, data);
            console.log(`[PAYMENT_SERVICE] Статус платежу з externalId ${externalId} змінено на: ${status}`);


            if(status === "PAID") {
                //Якщо оплата успішна — міняємо статус замовлення в модулі order на "PAID"
                await this.deps.orderService.updateStatus(payment.orderId, {status: status});
                console.log(`[PAYMENT_SERVICE] Надіслано запит в OrderService для оновлення статусу замовлення з ID${payment.orderId}`);
            } else if (status == "FAILED") {
                //Якщо оплата зафейлилась, або користувач не здійснив оплату вчасно, викликаємо метод скасування в OrderService
                await this.deps.orderService.cancelOrder(payment.orderId);
                console.log(`[PAYMENT_SERVICE] Надіслано запит на скасування замовлення ID ${payment.orderId} через провал оплати`);
            }

            const response: PaymentResponse = toPaymentResponse(payment);

            return response;
        }
}