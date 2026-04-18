import {PrismaService} from "../database/prisma.service.ts";
import {asClass, asFunction, createContainer, InjectionMode} from "awilix";
import {AuthMiddleware} from "../../../api/middlewares/auth.middleware.ts";
import type {IAuthMiddleware} from "../../contracts/auth.middleware.contract.ts";
import {JwtProvider} from "../auth/jwt.provider.ts";
import type {IJwtProvider} from "../../contracts/jwt.contract.ts";
import type {IHashProvider} from "../../contracts/hash.contract.ts";
import {BcryptProvider} from "../cryptography/bcrypt.provider.ts";
import {authModuleDeps, type IAuthModuleCradle} from "../../../modules/auth/auth.module.ts";
import {type IUserModuleCradle, userModuleDeps} from "../../../modules/user/user.module.ts";
import type {Router} from "express";
import {createAppRouter} from "../../../api/routers/app.router.ts";




export interface ICradle extends
    IAuthModuleCradle,
    IUserModuleCradle {
        //global
        dbService: PrismaService;
        hashProvider: IHashProvider;
        jwtProvider: IJwtProvider;

        authMiddleware: IAuthMiddleware;
        appRouter: Router;
    }

// Створюємо контейнер із режимом PROXY для зручної ін'єкції через деструктуризацію
export const container = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY,
});

/**
 * 2. Реєстрація залежностей.
 */
container.register({
    //global
    dbService: asClass(PrismaService).singleton(),
    hashProvider: asClass(BcryptProvider).singleton(),
    jwtProvider: asClass(JwtProvider).singleton(),

    authMiddleware: asClass(AuthMiddleware).singleton(),
    appRouter: asFunction(createAppRouter).singleton(),


    //modules
    ...authModuleDeps,
    ...userModuleDeps,
});