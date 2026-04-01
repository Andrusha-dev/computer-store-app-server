import {PrismaService} from "./infrastructure/database/prisma.service.ts";
import {UserRepository} from "./modules/user/data-access/user.repository.ts";
import {asClass, createContainer, InjectionMode} from "awilix";
import {UserService} from "./modules/user/domain/user.service.ts";
import {AuthService} from "./modules/auth/domain/auth.service.ts";
import {UserController} from "./modules/user/api/user.controller.ts";
import {UserRouter} from "./modules/user/api/user.router.ts";
import {AppRouter} from "./app.router.ts";
import type {IUserRepository} from "./modules/user/domain/user.repository.contract.ts";
import type {IUserService} from "./modules/user/domain/user.service.contract.ts";
import type {IUserController} from "./modules/user/api/user.contract.ts";
import type {IAuthService} from "./modules/auth/domain/auth.service.contract.ts";
import type {IAuthController} from "./modules/auth/api/auth.controller.contract.ts";
import {AuthController} from "./modules/auth/api/auth.controller.ts";
import {AuthRouter} from "./modules/auth/api/auth.router.ts";
import {AuthMiddleware} from "./shared/auth/auth.middleware.ts";
import type {IAuthMiddleware} from "./shared/auth/auth.contract.ts";
import {JwtProvider} from "./infrastructure/auth/jwt.provider.ts";
import type {IJwtProvider} from "./infrastructure/auth/jwt.contract.ts";
import type {IDatabaseService} from "./infrastructure/database/database.contract.ts";
import type {IHashProvider} from "./infrastructure/cryptography/hash.contract.ts";
import {BcryptProvider} from "./infrastructure/cryptography/bcrypt.provider.ts";
import type {IRouter} from "./shared/contracts/router.contract.ts";



export interface ICradle {
    //Залежності сторонніх бібліотек
    dbService: IDatabaseService;
    hashProvider: IHashProvider;
    jwtProvider: IJwtProvider;

    //Залежності модулів
    userRepository: IUserRepository;
    userService: IUserService;
    userController: IUserController;
    userRouter: IRouter;

    authService: IAuthService;
    authController: IAuthController;
    authRouter: IRouter;


    //middlewares
    authMiddleware: IAuthMiddleware;

    //Глобальні залежності
    appRouter: IRouter;
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
    dbService: asClass(PrismaService).singleton(),
    hashProvider: asClass(BcryptProvider).singleton(),
    jwtProvider: asClass(JwtProvider).singleton(),

    // Репозиторії (asClass)
    userRepository: asClass(UserRepository).singleton(),
    userService: asClass(UserService).singleton(),
    userController: asClass(UserController).singleton(),
    // Модульні роутери (реєструємо як функції)
    userRouter: asClass(UserRouter).singleton(),


    authService: asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton(),
    authRouter: asClass(AuthRouter).singleton(),


    //middlewares
    authMiddleware: asClass(AuthMiddleware).singleton(),

    // Головний роутер
    appRouter: asClass(AppRouter).singleton(),
    // Тут мають бути нові модулі:
    // processorRepository: asClass(ProcessorRepository).singleton(),

});