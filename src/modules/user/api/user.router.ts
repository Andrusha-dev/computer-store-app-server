import type {IUserController} from "./user.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {createUserDtoSchema, fetchUserByIdParamsSchema} from "./user.dto.ts";
import type {IRouter} from "../../../shared/contracts/router.contract.ts";


interface Dependencies {
    userController: IUserController;
    authMiddleware: IAuthMiddleware;
}

export class UserRouter implements IRouter {
    private readonly router: Router;
    private readonly userController: IUserController;
    private readonly authMiddleware: IAuthMiddleware;

    constructor({userController, authMiddleware}: Dependencies) {
        this.router = Router();
        this.userController = userController;
        this.authMiddleware = authMiddleware;
        this.setupRoutes();
    }


    //* ПОРЯДОК МАЄ ЗНАЧЕННЯ:
    //* 1. Статичні шляхи ( /me )
    //* 2. Динамічні шляхи ( /:id )
    //* 3. Кореневі шляхи ( / )


    private setupRoutes = (): void => {
        // GET /api/users/me -> Отримання власного профілю
        this.router.get(
            "/me",
            this.authMiddleware.authenticate,
            this.userController.me
        );

        // GET /api/users/:id -> Отримання публічного профілю за ID
        this.router.get(
            "/:id",
            this.authMiddleware.authenticate,
            this.authMiddleware.authorize(["admin"]),
            validate({ params: fetchUserByIdParamsSchema }),
            this.userController.show
        );

        // GET /api/users -> Список користувачів (з пагінацією та фільтрами)
        /*
        this.router.get(
            "/",
            this.authMiddleware.authenticate,
            this.authMiddleware.authorize(["admin"]),
            validate({ query: getUsersListQuerySchema }),
            this.userController.index
        );
        */

        // POST /api/users -> Реєстрація або створення (Public або Admin)
        this.router.post(
            "/",
            validate({ body: createUserDtoSchema }),
            this.userController.register
        );
    }

    public getRouter = (): Router => {
        return this.router;
    }
}




/*
import {Router} from "express";
import {validate} from "../../../shared/validation/validation.middleware.ts";
import {createUserDtoSchema, fetchUserByIdParamsSchema, getUsersListQuerySchema} from "./user.dto.ts";
import type {IUserController} from "./user.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/schemas/schemas.middleware.contract.ts";


interface Dependencies {
    userController: IUserController;
    authMiddleware: IAuthMiddleware;
}

export const createUserRouter = ({userController, authMiddleware}: Dependencies): Router => {
    const router = Router();


     //* ПОРЯДОК МАЄ ЗНАЧЕННЯ:
     //* 1. Статичні шляхи ( /me )
     //* 2. Динамічні шляхи ( /:id )
     //* 3. Кореневі шляхи ( / )


    // GET /api/users/me -> Отримання власного профілю
    router.get(
        "/me",
        authMiddleware.authenticate,
        userController.me
    );

    // GET /api/users/:id -> Отримання публічного профілю за ID
    router.get(
        "/:id",
        validate({ params: fetchUserByIdParamsSchema }),
        userController.show
    );

    // GET /api/users -> Список користувачів (з пагінацією та фільтрами)
    router.get(
        "/",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({ query: getUsersListQuerySchema }),
        userController.index
    );

    // POST /api/users -> Реєстрація або створення (Public або Admin)
    router.post(
        "/",
        validate({ body: createUserDtoSchema }),
        userController.register
    );

    return router;
};
*/