import {Router} from "express";




interface Dependencies {
    authRouter: Router;
    userRouter: Router;
    productRouter: Router;
}

export const createAppRouter  = ({authRouter, userRouter, productRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    router.use("/products", productRouter);
    //Решта маршрутів будуть додаватись далі

    return router;
}