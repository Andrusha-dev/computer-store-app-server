import type {IPaymentRepository} from "./domain/payment.repository.contract.ts";
import type {IPaymentService} from "./domain/payment.service.contract.ts";
import type {IPaymentProvider} from "./domain/payment.provider.contract.ts";
import {asClass, asFunction} from "awilix";
import {PaymentRepository} from "./infrastructure/database/payment.repository.ts";
import {MonobankProvider} from "./infrastructure/providers/monobank/monobank.provider.ts";
import {PaymentService} from "./application/payment.service.ts";
import {PaymentWebhookController} from "./api/payment.controller.ts";
import {createPaymentRouter, type PaymentRouter} from "./api/payment.router.ts";
import {type IMonobankMiddleware, MonobankMiddleware} from "./api/verify-monobank-signature.middleware.ts";




export interface IPaymentModuleCradle {
    paymentRepository: IPaymentRepository;
    paymentProvider: IPaymentProvider;
    paymentService: IPaymentService;
    monobankMiddleware: IMonobankMiddleware;
    paymentWebhookController: PaymentWebhookController;
    paymentRouter: PaymentRouter;
}

export const paymentModuleDeps = {
    paymentRepository: asClass(PaymentRepository).singleton(),
    paymentProvider: asClass(MonobankProvider).singleton(),
    paymentService: asClass(PaymentService).singleton(),
    monobankMiddleware: asClass(MonobankMiddleware).singleton(),
    paymentWebhookController: asClass(PaymentWebhookController).singleton(),
    paymentRouter: asFunction(createPaymentRouter).singleton()
}