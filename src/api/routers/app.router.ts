import {Router} from "express";




interface Dependencies {
    authRouter: Router;
    userRouter: Router;
    productRouter: Router;
    producerRouter: Router;
    cartRouter: Router;
    orderRouter: Router;
    paymentRouter: Router;
}

export const createAppRouter  = ({authRouter, userRouter, productRouter, producerRouter, cartRouter, orderRouter, paymentRouter}: Dependencies): Router => {
    const router = Router();

    router.use("/users", userRouter);
    router.use("/auth", authRouter);
    router.use("/products", productRouter);
    router.use("/producers", producerRouter);
    router.use("/cart", cartRouter);
    router.use("/orders", orderRouter);
    router.use("/payments", paymentRouter);
    //Решта маршрутів будуть додаватись далі

    return router;
}