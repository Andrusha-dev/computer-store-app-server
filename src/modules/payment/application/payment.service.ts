import type {IPaymentRepository} from "../domain/payment.repository.contract";
import type {IOrderService} from "../../order/application/order.service.contract";
import type {IPaymentService} from "../domain/payment.service.contract";
import type {PaymentEntity} from "../domain/payment.entity";
import {toPaymentResponse} from "../api/payment.mapper";
import type {CreateInvoiceResponse, MonobankWebhookDto, PaymentResponse, PaymentStatus} from "../api/payment.dto";
import type {CreateInvoiceOutput, IPaymentProvider} from "../domain/payment.provider.contract";
import {BadGatewayError} from "../../../shared/error/custom.errors";
import {Prisma} from "../../../../prisma/generated/client";
import type {ILoggerService} from "../../../shared/contracts/logger.contract";



interface Dependencies {
    paymentRepository: IPaymentRepository;
    paymentProvider: IPaymentProvider;
    orderService: IOrderService;
    logger: ILoggerService;
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
                this.deps.logger.info(
                    `[PAYMENT_SERVICE] Інвойс для замовлення ${orderId} успішно створено. invoiceId ${invoice.invoiceId}`,
                    {invoiceId: invoice.invoiceId, orderId: orderId, amount: amount, pageUrl: invoice.pageUrl}
                )
            } catch (error) {
                this.deps.logger.error(
                    `[BANK_DOWN] Монобанк не відповів для замовлення ${orderId}`,
                        error,
                        {orderId, paymentId, amount}
                )

                throw new BadGatewayError("Платіжна система тимчасово недоступна. Спробуйте виконати оплату ще раз за кілька хвилин");
            }

            try {
                //Оновлюємо поле externalId
                const data: Prisma.PaymentUpdateInput = { externalId: invoice.invoiceId };
                const payment: PaymentEntity = await this.deps.paymentRepository.update(paymentId, data);
                this.deps.logger.info(
                    `[PAYMENT_SERVICE] Поле інвойс оплати успішно оновлено. externalId ${payment.externalId}`,
                    {orderId: payment.orderId, paymentId: payment.id, externalId: payment.externalId}
                );

                const paymentResponse: PaymentResponse = toPaymentResponse(payment);
                //Повертаємо дані платежу разом із посиланням на оплату
                const response: CreateInvoiceResponse = {
                    payment: paymentResponse,
                    paymentUrl: invoice.pageUrl
                };

                return response;
            } catch (error) {
                this.deps.logger.error(
                    `[CRITICAL_DATABASE_ERROR] Інвойс в банку створено, але не вдалося оновити externalId для платежу замовлення ${orderId}`,
                    error,
                    {orderId, paymentId, amount, externalId: invoice.invoiceId, paymentUrl: invoice.pageUrl}
                )

                //Якщо під час оновлення в бд сталася помилка, прокидуємо помилку далі
                throw error;
            }

        }

    //Оновлення статусів Order та Payment (Викликається вебхуком монобанку). tx можна не використовувати, бо якщо наприклад впала бд,
    //вебхук монобанку не отримає код 200 і буде повторно надсилати запити. І коли бд відновиться, то після чергового вебхуку
    //статуси в Order та Payment оновляться і сервер монобанку отримає статус 200
    processMonobankWebhook =
        async (dto: MonobankWebhookDto): Promise<void> => {
            const {invoiceId, status} = dto;

            //Якщо статус проміжний — ми просто логуємо це для інфо і миттєво виходимо
            if (status !== "success" && status !== "failure" && status !== "expired" && status !== "reversed") {
                this.deps.logger.info(`[PAYMENT_SERVICE]: Ignored intermediate Monobank webhook status: ${status} for invoice ${invoiceId}`);
                return;
            }

            //Мапимо статус. Якщо status "success" то systemStatus "PAID", а якщо status "failure" або "expired" - то systemStatus "FAILED"
            let systemStatus: Extract<PaymentStatus, "PAID" | "FAILED" | "REFUNDED">;
            if (status === "success") {
                systemStatus = "PAID";
            } else if (status === "reversed") {
                systemStatus = "REFUNDED"
            } else {
                systemStatus = "FAILED"
            }


            const data: Prisma.PaymentUpdateInput = {status: systemStatus}

            //Оновлюємо статус самого платежу в модулі payment
            const payment: PaymentEntity = await this.deps.paymentRepository.updateStatusByExternalId(invoiceId, data);
            this.deps.logger.info(`[PAYMENT_SERVICE]: Оновлено статус оплати до ${payment.status} для інвойса ${payment.externalId}`);

            if(systemStatus === "PAID") {
                //Якщо оплата успішна — міняємо статус замовлення в модулі order на "PAID"
                await this.deps.orderService.updateStatusToPaid(payment.orderId);
            } else if (systemStatus == "FAILED" || systemStatus == "REFUNDED") {
                //Якщо оплата зафейлилась, або користувач не здійснив оплату вчасно, чи стався збій при передачі коштів платіжній системі банком клієнта (REFUNDED), викликаємо метод скасування в OrderService
                await this.deps.orderService.cancelOrder(payment.orderId);
            }
        }
}