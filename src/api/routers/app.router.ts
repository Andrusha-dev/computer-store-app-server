import {Router} from "express";




interface Dependencies {
    authRouter: Router;
    userRouter: Router;
    productRouter: Router;
    producerRouter: Router;
    cartRouter: Router
}

export const createAppRouter  = ({authRouter, userRouter, productRouter, producerRouter, cartRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    router.use("/products", productRouter);
    router.use("/producers", producerRouter);
    router.use("/cart", cartRouter);
    //Решта маршрутів будуть додаватись далі

    return router;
}