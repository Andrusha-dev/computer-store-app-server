import type {IPaymentRepository} from "./domain/payment.repository.contract";
import type {IPaymentService} from "./domain/payment.service.contract";
import type {IPaymentProvider} from "./domain/payment.provider.contract";
import {asClass, asFunction} from "awilix";
import {PaymentRepository} from "./infrastructure/database/payment.repository";
import {MonobankProvider} from "./infrastructure/providers/monobank/monobank.provider";
import {PaymentService} from "./application/payment.service";
import {PaymentWebhookController} from "./api/payment.controller";
import {createPaymentRouter, type PaymentRouter} from "./api/payment.router";
import {type IMonobankMiddleware, MonobankMiddleware} from "./api/verify-monobank-signature.middleware";




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