import {PrismaService} from "../database/prisma.service";
import {asClass, asFunction, asValue, createContainer, InjectionMode} from "awilix";
import {AuthMiddleware} from "../../../api/middlewares/auth.middleware";
import type {IAuthMiddleware} from "../../contracts/auth.middleware.contract";
import {JwtProvider} from "../auth/jwt.provider";
import type {IJwtProvider} from "../../contracts/jwt.contract";
import type {IHashProvider} from "../../contracts/hash.contract";
import {BcryptProvider} from "../cryptography/bcrypt.provider";
import {type AppRouter, createAppRouter} from "../../../api/routers/app.router";
import {authModuleDeps, type IAuthModuleCradle} from "../../../modules/auth/index";
import {type IUserModuleCradle, userModuleDeps} from "../../../modules/user/index";
import {type IProductModuleCradle, productModuleDeps} from "../../../modules/product/index";
import {type IProducerModuleCradle, producerModuleDeps} from "../../../modules/producer/index";
import {cartModuleDeps, type ICartModuleCradle} from "../../../modules/cart/index";
import {type IOrderModuleCradle, orderModuleDeps} from "../../../modules/order/index";
import {type IPaymentModuleCradle, paymentModuleDeps} from "../../../modules/payment/index";
import {deliveryModuleDeps, type IDeliveryModuleCradle} from "../../../modules/delivery/index";
import {config, type Config} from "../config/index";
import type {ILoggerService} from "../../contracts/logger.contract";
import {PinoLoggerService} from "../logger/pino-logger.service";
import {ErrorHandler} from "../../../api/middlewares/error.middleware";




export interface ICradle extends
    IAuthModuleCradle,
    IUserModuleCradle,
    IProductModuleCradle,
    IProducerModuleCradle,
    ICartModuleCradle,
    IOrderModuleCradle,
    IPaymentModuleCradle,
    IDeliveryModuleCradle {
        //global
        config: Config;
        dbService: PrismaService;
        hashProvider: IHashProvider;
        jwtProvider: IJwtProvider;
        logger: ILoggerService

        authMiddleware: IAuthMiddleware;
        errorHandler: ErrorHandler;
        appRouter: AppRouter;
    }

// Створюємо контейнер із режимом PROXY для зручної ін'єкції через деструктуризацію
export const container = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY,
});

//Реєстрація залежностей у контейнері
container.register({
    //global
    config: asValue(config),
    dbService: asClass(PrismaService).singleton(),
    hashProvider: asClass(BcryptProvider).singleton(),
    jwtProvider: asClass(JwtProvider).singleton(),
    logger: asClass(PinoLoggerService).singleton(),

    authMiddleware: asClass(AuthMiddleware).singleton(),
    errorHandler: asClass(ErrorHandler).singleton(),
    appRouter: asFunction(createAppRouter).singleton(),

    //modules
    ...authModuleDeps,
    ...userModuleDeps,
    ...productModuleDeps,
    ...producerModuleDeps,
    ...cartModuleDeps,
    ...orderModuleDeps,
    ...paymentModuleDeps,
    ...deliveryModuleDeps
});