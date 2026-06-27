import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware";
import {
    createProductDtoSchema,
    productParamsSchema,
    productsQuerySchema,
    updateProductDtoSchema
} from "./product.dto";
import type {ProductController} from "./product.controller";


interface Dependencies {
    productController: ProductController;
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

export type ProductRouter = ReturnType<typeof createProductRouter>;