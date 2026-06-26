import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {
    createOrderDtoSchema,
    orderParamsSchema,
    ordersQuerySchema,
    setTrackingNumberDtoSchema
} from "./order.dto.ts";
import type {OrderController} from "./order.controller.ts";


interface Dependencies {
    orderController: OrderController;
    authMiddleware: IAuthMiddleware;
}

export const createOrderRouter = ({orderController, authMiddleware}: Dependencies) => {
    const router = Router();

    router.get(
        "/my/:id",
        authMiddleware.authenticate,
        validate({params: orderParamsSchema}),
        orderController.findMyFullById
    );

    router.get(
        "/my",
        authMiddleware.authenticate,
        validate({query: ordersQuerySchema}),
        orderController.findMyMany
    );

    router.get(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: orderParamsSchema}),
        orderController.findFullById
    );

    router.get(
        "/",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({query: ordersQuerySchema}),
        orderController.findMany
    );

    router.post(
        "/",
        authMiddleware.authenticate,
        validate({body: createOrderDtoSchema}),
        orderController.create
    );

    router.patch(
        "/:id/retry-payment",
        authMiddleware.authenticate,
        validate({params: orderParamsSchema}),
        orderController.retryPayment
    );

    router.patch(
        "/:id/delivery/tracking-number",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: orderParamsSchema, body: setTrackingNumberDtoSchema}),
        orderController.setTrackingNumber
    );

    router.patch(
        "/:id/status/completed",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: orderParamsSchema}),
        orderController.updateStatusToCompleted
    );

    router.patch(
        "/:id/cancel-order",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: orderParamsSchema}),
        orderController.cancelOrder
    )

    return router;
}

export type OrderRouter = ReturnType<typeof createOrderRouter>;

