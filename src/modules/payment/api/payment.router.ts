import {Router} from "express";
import type {IMonobankMiddleware} from "./verify-monobank-signature.middleware.ts";
import type {PaymentWebhookController} from "./payment.controller.ts";




interface Dependencies {
    monobankMiddleware: IMonobankMiddleware;
    paymentWebhookController: PaymentWebhookController;
}

export const createPaymentRouter = ({monobankMiddleware, paymentWebhookController}: Dependencies) => {
    const router = Router();

    router.post(
        "/webhook/monobank",
        monobankMiddleware.verify,
        //мідлвару validate ми не використовуєм для фінансових операцій, бо у випадку помилки валідації банк отримає
        //код з помилкою і буде далі бомбардувати наш ендпойнт вебхуками, і в результаті взагалі заблокує подальші вебхуки і для інших оплат
        //Тому валідацію слід проводити в самому контролері методом safeParse() і при будь-якому результаті повертати банку код 200
        paymentWebhookController.handleMonobankWebhook
    );

    return router;
}

export type PaymentRouter = ReturnType<typeof createPaymentRouter>;