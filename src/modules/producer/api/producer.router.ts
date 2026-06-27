import type {IAuthMiddleware} from "../../../shared/contracts/auth.middleware.contract";
import {Router} from "express";
import {validate} from "../../../api/middlewares/validation.middleware";
import {
    createProducerDtoSchema,
    producerParamsSchema,
    producersQuerySchema,
    updateProducerDtoSchema
} from "./producer.dto";
import type {ProducerController} from "./producer.controller";


interface Dependencies {
    producerController: ProducerController;
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

export type ProducerRouter = ReturnType<typeof createProducerRouter>;
