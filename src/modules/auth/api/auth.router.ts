import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {loginDtoSchema, refreshAllTokensDtoSchema} from "./auth.dto.ts";
import type {AuthController} from "./auth.controller.ts";




interface Dependencies {
    authController: AuthController;
}

export const createAuthRouter = ({authController}: Dependencies): Router => {
    const router = Router();

    router.post(
        "/login",
        validate({body: loginDtoSchema}),
        authController.login
    );

    router.post(
        "/refresh",
        validate({body: refreshAllTokensDtoSchema}),
        authController.refresh
    );

    return router;
}

export type AuthRouter = ReturnType<typeof createAuthRouter>;