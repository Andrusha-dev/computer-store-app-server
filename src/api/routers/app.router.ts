import {Router} from "express";
import type {IRouter} from "../../shared/contracts/router.contract.ts";


interface Dependencies {
    authRouter: IRouter;
    userRouter: IRouter;
}

export class AppRouter implements IRouter {
    private readonly router: Router;
    private readonly authRouter: IRouter;
    private readonly userRouter: IRouter;


    constructor({userRouter, authRouter}: Dependencies) {
        this.router = Router();
        this.authRouter = authRouter;
        this.userRouter = userRouter;
        this.setupRoutes();
    }

    private setupRoutes = (): void => {
        this.router.use("/users", this.userRouter.getRouter());
        this.router.use("/auth", this.authRouter.getRouter());
        //Решта маршрутів будуть додаватись далі
    }

    public getRouter = (): Router => {
        return this.router;
    }

}




/*
import {Router} from "express";
import type {IRouter} from "./shared/contracts/router.contract.ts";


interface Dependencies {
    userRouter: IRouter;
    authRouter: IRouter;
}

export const createAppRouter = ({userRouter, authRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter.getRouter());
    router.use("/schemas", authRouter.getRouter());
    //Решта маршрутів будуть додаватись далі

    return router;
}
*/
