import type {IProductController} from "./product.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {
    createProductDtoSchema,
    productParamsSchema,
    productsQuerySchema,
    updateProductDtoSchema
} from "./product.dto.ts";


interface Dependencies {
    productController: IProductController;
    authMiddleware: IAuthMiddleware;
}

export const createProductRouter = ({productController, authMiddleware}: Dependencies) => {
    const router = Router();

    router.get(
        "/:id/full",
        authMiddleware.authenticate,
        validate({params: productParamsSchema}),
        productController.findFullById
    );

    router.get(
        "/:id",
        authMiddleware.authenticate,
        validate({params: productParamsSchema}),
        productController.findById
    );

    router.get(
        "/",
        authMiddleware.authenticate,
        validate({query: productsQuerySchema}),
        productController.findMany
    );

    router.post(
        "/",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({body: createProductDtoSchema}),
        productController.create
    );

    router.patch(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: productParamsSchema, body: updateProductDtoSchema}),
        productController.update
    );

    router.delete(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: productParamsSchema}),
        productController.delete
    );

    return router;
}