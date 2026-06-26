import type {Request, Response} from "express";
import type {IPaymentService} from "../domain/payment.service.contract.ts";
import {monobankWebhookDtoSchema, type PaymentStatus} from "./payment.dto.ts";




interface Dependencies {
    paymentService: IPaymentService;
}

export class PaymentWebhookController {
    private readonly paymentService: IPaymentService;

    constructor({paymentService}: Dependencies) {
        this.paymentService = paymentService;
    }

    //В маршруті меред цим методом контроллера обовязкова має бути мідлвара verifyMonobankSignature
    handleMonobankWebhook =
        async (req: Request, res: Response): Promise<void> => {
           //Фінансові операції передбачають валідацію вхідних даних в контролері а не в мідлварі
            const result = monobankWebhookDtoSchema.safeParse(req.body);

            if(!result.success) {
                res.status(200).send("OK");
                //При помилці валідації повертаємо банку код 200, щоб він не бомбардував цим вебхуком надалі і не забивав нам логи
                //І обовязково логуємо помилку. Далі потрібно буде перевірити всі записи payment зі статусом PENDING чи вони по факту оплачені в банку
                //Якщо так, то потрібно буде змінити status в payment та order на PAID. І потрібно буде врахувати в коді відповідні зміни в контрактах api
                console.error("[CRITICAL] Валідація вебхуку монобанку завершилась помилкою!")
                return;
            }

            const { invoiceId, status } = result.data;

            //Якщо статус проміжний — логуємо, відповідаємо 200 і виходимо
            if (status !== "success" && status !== "failure" && status !== "expired" && status !== "reversed") {
                res.status(200).send("OK");
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

            // Викликаємо сервіс і завершуємо запит
            await this.paymentService.updateStatusByExternalId(invoiceId, systemStatus);
            res.status(200).send("OK");
        }
}