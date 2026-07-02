import type {Request, Response} from "express";
import type {IPaymentService} from "../domain/payment.service.contract";
import {monobankWebhookDtoSchema} from "./payment.dto";
import type {ILoggerService} from "../../../shared/contracts/logger.contract";




interface Dependencies {
    paymentService: IPaymentService;
    logger: ILoggerService;
}

export class PaymentWebhookController {
    private readonly paymentService: IPaymentService;
    private readonly logger: ILoggerService;

    constructor({paymentService, logger}: Dependencies) {
        this.paymentService = paymentService;
        this.logger = logger;
    }

    //В маршруті меред цим методом контроллера обовязкова має бути мідлвара verifyMonobankSignature
    handleMonobankWebhook =
        async (req: Request, res: Response): Promise<void> => {
           //Фінансові операції передбачають валідацію вхідних даних в контролері а не в мідлварі
            const result = monobankWebhookDtoSchema.safeParse(req.body);

            //Якщо валідація вхідних даних невдала, все одно повертаємо статус 200, щоб банк не бомбардував повторними запитами
            if(!result.success) {
                res.status(200).send("OK");
                //При помилці валідації повертаємо банку код 200, щоб він не бомбардував цим вебхуком надалі і не забивав нам логи
                //І обовязково логуємо помилку. Далі потрібно буде перевірити всі записи payment зі статусом PENDING чи вони по факту оплачені в банку
                //Якщо так, то потрібно буде змінити status в payment та order на PAID. І потрібно буде врахувати в коді відповідні зміни в контрактах api
                this.logger.error(
                    "[CRITICAL_VALIDATION_ERROR] Валідація вебхуку монобанку завершилась помилкою!",
                    result.error,
                    {controller: "PaymentWebhookController"}
                );
                return;
            }


            // Викликаємо сервіс і завершуємо запит
            await this.paymentService.processMonobankWebhook(result.data);
            res.status(200).send("OK");
        }
}