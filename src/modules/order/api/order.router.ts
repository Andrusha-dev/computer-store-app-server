import type {IOrderController} from "./order.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {createOrderDtoSchema, orderParamsSchema, ordersQuerySchema, updateOrderStatusDtoSchema} from "./order.dto.ts";


interface Dependencies {
    orderController: IOrderController;
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
        "/:id/status",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: orderParamsSchema, body: updateOrderStatusDtoSchema}),
        orderController.updateStatus
    );

    return router;
}

