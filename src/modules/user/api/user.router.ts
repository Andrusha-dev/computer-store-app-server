import type {IUserController} from "./user.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {createUserDtoSchema, fetchUserByIdParamsSchema, getUsersListQuerySchema} from "./user.dto.ts";




interface Dependencies {
    userController: IUserController;
    authMiddleware: IAuthMiddleware;
}

export const createUserRouter = ({userController, authMiddleware}: Dependencies) => {
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
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
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
}