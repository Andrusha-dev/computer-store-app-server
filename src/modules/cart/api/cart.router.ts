import type {ICartController} from "./cart.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {cartItemParamsSchema, createCartItemDtoSchema, updateCartItemQuantityDtoSchema} from "./cart.dto.ts";


interface Dependencies {
    authMiddleware: IAuthMiddleware;
    cartController: ICartController;
}

export const createCartRouter = ({authMiddleware, cartController}: Dependencies) => {
    const router = Router();

    router.get(
        "/",
        authMiddleware.authenticate,
        cartController.findMyCartFullByUserId,
    );

    router.post(
        "/items",
        authMiddleware.authenticate,
        validate({body: createCartItemDtoSchema}),
        cartController.createItem,
    );

    router.patch(
        "/items/:productId",
        authMiddleware.authenticate,
        validate({params: cartItemParamsSchema, body: updateCartItemQuantityDtoSchema}),
        cartController.updateItemQuantity,
    );

    router.delete(
        "/items/:productId",
        authMiddleware.authenticate,
        validate({params: cartItemParamsSchema}),
        cartController.deleteItem,
    );

    router.delete(
        "/items",
        authMiddleware.authenticate,
        cartController.clearCart,
    );

    return router;
}