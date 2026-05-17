import {Router} from "express";




interface Dependencies {
    authRouter: Router;
    userRouter: Router;
    productRouter: Router;
    producerRouter: Router;
}

export const createAppRouter  = ({authRouter, userRouter, productRouter, producerRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    router.use("/products", productRouter);
    router.use("/producers", producerRouter)
    //Решта маршрутів будуть додаватись далі

    return router;
}