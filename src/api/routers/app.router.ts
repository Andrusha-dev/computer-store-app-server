import {Router} from "express";




interface Dependencies {
    authRouter: Router;
    userRouter: Router;
}

export const createAppRouter  = ({authRouter, userRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    //Решта маршрутів будуть додаватись далі

    return router;
}