import prisma from "./infrastructure/persistence/prisma.ts";
import {UserRepository} from "./modules/user/data-access/user.repository.ts";
import {asClass, asFunction, asValue, createContainer, InjectionMode} from "awilix";
import {UserService} from "./modules/user/domain/user.service.ts";
import type {PrismaClient} from "./generated/prisma/client.ts";
import {AuthService} from "./modules/auth/domain/auth.service.ts";
import {UserController} from "./modules/user/api/user.controller.ts";
import {createUserRouter} from "./modules/user/api/user.router.ts";
import {createAppRouter} from "./app.router.ts";
import {Router} from "express";
import type {IUserRepository} from "./modules/user/domain/user.repository.contract.ts";
import type {IUserService} from "./modules/user/domain/user.contract.ts";
import type {IUserController} from "./modules/user/api/user.contract.ts";
import type {IAuthService} from "./modules/auth/domain/auth.contract.ts";
import type {IAuthController} from "./modules/auth/api/auth.contract.ts";
import {AuthController} from "./modules/auth/api/auth.controller.ts";
import {createAuthRouter} from "./modules/auth/api/auth.router.ts";
import {AuthMiddleware} from "./shared/auth/auth.middleware.ts";
import type {IAuthMiddleware} from "./shared/auth/auth.contract.ts";
import {hashProvider, type IHashProvider} from "./infrastructure/auth/hash.provider.ts";
import {type IJwtProvider, jwtProvider} from "./infrastructure/auth/jwt.provider.ts";



export interface ICradle {
    //Залежності сторонніх бібліотек
    prisma: PrismaClient;
    hashProvider: IHashProvider;
    jwtProvider: IJwtProvider;

    //Залежності модулів
    userRepository: IUserRepository;
    userService: IUserService;
    userController: IUserController;
    userRouter: Router;

    authService: IAuthService;
    authController: IAuthController;
    authRouter: Router;


    //middlewares
    authMiddleware: IAuthMiddleware;

    //Глобальні залежності
    appRouter: Router;
    //Нові залежності слід додавати сюди
}

// Створюємо контейнер із режимом PROXY для зручної ін'єкції через деструктуризацію
export const container = createContainer<ICradle>({
    injectionMode: InjectionMode.PROXY,
});

/**
 * 2. Реєстрація залежностей.
 */
container.register({
    // Технічні утиліти (asValue, бо це вже готові об'єкти)
    prisma: asValue(prisma),
    hashProvider: asValue(hashProvider),
    jwtProvider: asValue(jwtProvider),

    // Репозиторії (asClass)
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    // Модульні роутери (реєструємо як функції)
    userRouter: asFunction(createUserRouter).singleton(),


    authService: asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton(),
    authRouter: asFunction(createAuthRouter).singleton(),


    //middlewares
    authMiddleware: asClass(AuthMiddleware).singleton(),

    // Головний роутер
    appRouter: asFunction(createAppRouter).singleton(),
    // Тут мають бути нові модулі:
    // processorRepository: asClass(ProcessorRepository).singleton(),

});