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

            const paymentResponse: PaymentResponse = toPaymentResponse(payment);
            //Повертаємо дані платежу разом із посиланням на оплату
            const response: CreateInvoiceResponse = {
                payment: paymentResponse,
                paymentUrl: invoice.pageUrl
            };

            return response;
        }

    //Оновлення статусів Order та Payment (Викликається вебхуком монобанку). tx можна не використовувати, бо якщо наприклад впала бд,
    //вебхук монобанку не отримає код 200 і буде повторно надсилати запити. І коли бд відновиться, то після чергового вебхуку
    //статуси в Order та Payment оновляться і сервер монобанку отримає статус 200
    updateStatusByExternalId =
        async (externalId: string, status: Extract<PaymentStatus, "PAID" | "FAILED" | "REFUNDED">): Promise<PaymentResponse> => {
            const data: Prisma.PaymentUpdateInput = {status: status}

            //Оновлюємо статус самого платежу в модулі payment
            const payment: PaymentEntity = await this.deps.paymentRepository.updateStatusByExternalId(externalId, data);

            if(status === "PAID") {
                //Якщо оплата успішна — міняємо статус замовлення в модулі order на "PAID"
                await this.deps.orderService.updateStatusToPaid(payment.orderId);
            } else if (status == "FAILED" || status == "REFUNDED") {
                //Якщо оплата зафейлилась, або користувач не здійснив оплату вчасно, чи стався збій при передачі коштів платіжній системі банком клієнта (REFUNDED), викликаємо метод скасування в OrderService
                await this.deps.orderService.cancelOrder(payment.orderId);
            }

            const response: PaymentResponse = toPaymentResponse(payment);

            return response;
        }
}