import {Router} from "express";
import {validate} from "../../../shared/validation/validation.middleware.ts";
import {createUserDtoSchema, fetchUserByIdParamsSchema, getUsersListQuerySchema} from "./user.dto.ts";
import type {IUserController} from "./user.contract.ts";
import type {IAuthMiddleware} from "../../../shared/auth/auth.contract.ts";


interface Dependencies {
    userController: IUserController;
    authMiddleware: IAuthMiddleware;
}

export const createUserRouter = ({userController, authMiddleware}: Dependencies): Router => {
    const router = Router();

    /**
     * ПОРЯДОК МАЄ ЗНАЧЕННЯ:
     * 1. Статичні шляхи ( /me )
     * 2. Динамічні шляхи ( /:id )
     * 3. Кореневі шляхи ( / )
     */

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