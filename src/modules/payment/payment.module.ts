import type {IPaymentRepository} from "./domain/payment.repository.contract.ts";
import type {IPaymentService} from "./domain/payment.service.contract.ts";
import type {IPaymentProvider} from "./domain/payment.provider.contract.ts";
import type {IPaymentWebhookController} from "./api/payment.controller.contract.ts";
import type {Router} from "express";
import {asClass, asFunction} from "awilix";
import {PaymentRepository} from "./infrastructure/database/payment.repository.ts";
import {MonobankProvider} from "./infrastructure/providers/monobank/monobank.provider.ts";
import {PaymentService} from "./application/payment.service.ts";
import {PaymentWebhookController} from "./api/payment.controller.ts";
import {createPaymentRouter} from "./api/payment.router.ts";




export interface IPaymentModuleCradle {
    paymentRepository: IPaymentRepository;
    paymentProvider: IPaymentProvider;
    paymentService: IPaymentService;
    paymentWebhookController: IPaymentWebhookController;
    paymentRouter: Router;
}

export const paymentModuleDeps = {
    paymentRepository: asClass(PaymentRepository).singleton(),
    paymentProvider: asClass(MonobankProvider).singleton(),
    paymentService: asClass(PaymentService).singleton(),
    paymentWebhookController: asClass(PaymentWebhookController).singleton(),
    paymentRouter: asFunction(createPaymentRouter).singleton()
}