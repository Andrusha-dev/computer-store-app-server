import {Router} from "express";


interface Dependencies {
    userRouter: Router;
    authRouter: Router;
}

export const createAppRouter = ({userRouter, authRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    //Решта маршрутів будуть додаватись далі

    return router;
}

