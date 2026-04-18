import type {IAuthController} from "./auth.controller.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {loginDtoSchema, refreshAllTokensDtoSchema} from "./auth.dto.ts";




interface Dependencies {
    authController: IAuthController;
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