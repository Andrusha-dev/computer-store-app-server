import type {IAuthController} from "./auth.controller.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
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