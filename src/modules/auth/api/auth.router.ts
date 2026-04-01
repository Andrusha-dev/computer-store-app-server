import type {IAuthController} from "./auth.controller.contract.ts";
import {Router} from "express";
import {validate} from "../../../shared/validation/validation.middleware.ts";
import {loginDtoSchema, refreshAllTokensDtoSchema} from "./auth.dto.ts";
import type {IRouter} from "../../../shared/contracts/router.contract.ts";



interface Dependencies {
    authController: IAuthController;
}


export class AuthRouter implements IRouter {
    private readonly router: Router;
    private readonly authController: IAuthController;

    constructor({authController}: Dependencies) {
        this.router = Router();
        this.authController = authController;
        this.setupRoutes();
    }


    private setupRoutes = (): void => {
        this.router.post(
            "/login",
            validate({body: loginDtoSchema}),
            this.authController.login
        );

        this.router.post(
            "/refresh",
            validate({body: refreshAllTokensDtoSchema}),
            this.authController.refresh
        );
    }

    public getRouter = (): Router => {
        return this.router;
    }
}




/*
import type {IAuthController} from "./auth.controller.contract.ts";
import {Router} from "express";
import {validate} from "../../../shared/validation/validation.middleware.ts";
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
*/