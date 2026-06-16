import type {IPaymentWebhookController} from "./payment.controller.contract.ts";
import {Router} from "express";
import {verifyMonobankSignature} from "../../../api/middlewares/verify-monobank-signature.middleware.ts";




interface Dependencies {
    paymentWebhookController: IPaymentWebhookController;
}

export const createPaymentRouter = ({paymentWebhookController}: Dependencies) => {
    const router = Router();

    router.post(
        "/webhook/monobank",
        verifyMonobankSignature,
        //мідлвару validate ми не використовуєм для фінансових операцій, бо у випадку помилки валідації банк отримає
        //код з помилкою і буде далі бомбардувати наш ендпойнт вебхуками, і в результаті взагалі заблокує подальші вебхуки і для інших оплат
        //Тому валідацію слід проводити в самому контролері методом safeParse() і при будь-якому результаті повертати банку код 200
        paymentWebhookController.handleMonobankWebhook
    );

    return router;
}