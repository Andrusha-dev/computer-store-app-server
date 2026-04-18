import express, {type Router} from "express";
import type { Express } from "express";
import {cors} from "../middlewares/cors.middleware.ts";
import {container} from "../../shared/infrastructure/di/container.ts";
import {errorHandler} from "../middlewares/error.middleware.ts";




export const expressLoader = async ():Promise<Express> => {
    const app = express();

    app.use(express.json());

    app.use(cors);

    const appRouter = container.resolve<Router>("appRouter");
    app.use("/api", appRouter);

    app.use(errorHandler);

    return app;
}