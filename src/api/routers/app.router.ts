import {Router} from "express";
import type {AuthRouter} from "../../modules/auth/api/auth.router.ts";
import type {CartRouter} from "../../modules/cart/api/cart.router.ts";
import type {OrderRouter} from "../../modules/order/api/order.router.ts";
import type {PaymentRouter} from "../../modules/payment/api/payment.router.ts";
import type {ProducerRouter} from "../../modules/producer/api/producer.router.ts";
import type {ProductRouter} from "../../modules/product/api/product.router.ts";
import type {UserRouter} from "../../modules/user/api/user.router.ts";




interface Dependencies {
    authRouter: AuthRouter;
    userRouter: UserRouter;
    productRouter: ProductRouter;
    producerRouter: ProducerRouter;
    cartRouter: CartRouter;
    orderRouter: OrderRouter;
    paymentRouter: PaymentRouter;
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

export type AppRouter = ReturnType<typeof createAppRouter>;