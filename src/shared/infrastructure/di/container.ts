import {PrismaService} from "../database/prisma.service.ts";
import {asClass, asFunction, asValue, createContainer, InjectionMode} from "awilix";
import {AuthMiddleware} from "../../../api/middlewares/auth.middleware.ts";
import type {IAuthMiddleware} from "../../contracts/auth.middleware.contract.ts";
import {JwtProvider} from "../auth/jwt.provider.ts";
import type {IJwtProvider} from "../../contracts/jwt.contract.ts";
import type {IHashProvider} from "../../contracts/hash.contract.ts";
import {BcryptProvider} from "../cryptography/bcrypt.provider.ts";
import {type AppRouter, createAppRouter} from "../../../api/routers/app.router.ts";
import {authModuleDeps, type IAuthModuleCradle} from "../../../modules/auth/index.ts";
import {type IUserModuleCradle, userModuleDeps} from "../../../modules/user/index.ts";
import {type IProductModuleCradle, productModuleDeps} from "../../../modules/product/index.ts";
import {type IProducerModuleCradle, producerModuleDeps} from "../../../modules/producer/index.ts";
import {cartModuleDeps, type ICartModuleCradle} from "../../../modules/cart/index.ts";
import {type IOrderModuleCradle, orderModuleDeps} from "../../../modules/order/index.ts";
import {type IPaymentModuleCradle, paymentModuleDeps} from "../../../modules/payment/index.ts";
import {deliveryModuleDeps, type IDeliveryModuleCradle} from "../../../modules/delivery/index.ts";
import {config, type Config} from "../config/index.ts";




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

        authMiddleware: IAuthMiddleware;
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

    authMiddleware: asClass(AuthMiddleware).singleton(),
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