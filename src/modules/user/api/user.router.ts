import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {
    createUserDtoSchema,
    updateUserDtoSchema, userParamsSchema, usersQuerySchema
} from "./user.dto.ts";
import type {UserController} from "./user.controller.ts";




interface Dependencies {
    userController: UserController;
    authMiddleware: IAuthMiddleware;
}

export const createUserRouter = ({userController, authMiddleware}: Dependencies) => {
    const router = Router();


    //ПОРЯДОК МАЄ ЗНАЧЕННЯ:
    //1. Статичні шляхи ( /me )
    //2. Динамічні шляхи ( /:id )
    //3. Кореневі шляхи ( / )



    // GET /api/users/me -> Отримання власного профілю
    router.get(
        "/me",
        authMiddleware.authenticate,
        userController.findFullById
    );

    // GET /api/users/:id -> Отримання профілю за ID
    router.get(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({ params: userParamsSchema }),
        userController.findById
    );

    // GET /api/users -> Список користувачів (з пагінацією та фільтрами)
    router.get(
        "/",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({ query: usersQuerySchema }),
        userController.findMany
    );


    // POST /api/users -> Реєстрація користувача
    router.post(
        "/",
        validate({ body: createUserDtoSchema }),
        userController.create
    );

    // PATCH /api/users -> Оновлення користувача
    router.patch(
        "/:id",
        authMiddleware.authenticate,
        validate({ params: userParamsSchema, body: updateUserDtoSchema }),
        userController.update
    );

    // DELETE /api/users -> Видалення користувача (лише для admin)
    router.delete(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({ params: userParamsSchema}),
        userController.delete
    );

    return router;
}

export type UserRouter = ReturnType<typeof createUserRouter>;