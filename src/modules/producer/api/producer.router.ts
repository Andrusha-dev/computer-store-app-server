import type {IProducerController} from "./producer.controller.contract.ts";
import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract.ts";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware.ts";
import {
    createProducerDtoSchema,
    producerParamsSchema,
    producersQuerySchema,
    updateProducerDtoSchema
} from "./producer.dto.ts";


interface Dependencies {
    producerController: IProducerController;
    authMiddleware: IAuthMiddleware;
}


export const createProducerRouter = ({producerController, authMiddleware}: Dependencies) => {
    const router =  Router();

    router.get(
        "/:id",
        authMiddleware.authenticate,
        validate({params: producerParamsSchema}),
        producerController.findById
    );

    router.get(
        "/",
        authMiddleware.authenticate,
        validate({query: producersQuerySchema}),
        producerController.findMany
    );

    router.post(
        "/",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({body: createProducerDtoSchema}),
        producerController.create
    );

    router.patch(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: producerParamsSchema, body: updateProducerDtoSchema}),
        producerController.update
    );

    router.delete(
        "/:id",
        authMiddleware.authenticate,
        authMiddleware.authorize(["admin"]),
        validate({params: producerParamsSchema}),
        producerController.delete
    );

    return router;
}
