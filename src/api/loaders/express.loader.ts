import express from "express";
import type { Express} from "express";
import {cors} from "../middlewares/cors.middleware";
import {container} from "../../shared/infrastructure/di/container";
import type {ErrorHandler} from "../middlewares/error.middleware";
import type {AppRouter} from "../routers/app.router";
import {pinoHttp} from "pino-http";
import type {Config} from "../../shared/infrastructure/config";




export const expressLoader = async ():Promise<Express> => {
    const config = container.resolve<Config>("config");
    const appRouter = container.resolve<AppRouter>("appRouter");
    const errorHandler = container.resolve<ErrorHandler>("errorHandler");


    const app = express();

    app.use(express.json({
        //За допомогою verify додаємо сире тіло запиту в обєкт req.body. Потрібно для вебхуків платіжних систем
        //аргументи req, res, buf - це сирі обєкти node js, до того, як express створить на їх основі свої обєкти req та res
        verify: (req, res, buf) => {
            if(req.headers["x-sign"] && buf && buf.length) {
                //Кладемо сирі дані в req.rawBody, щоб вони були доступні, коли express здійснить парсинг json
                (req as any).rawBody = buf;
            }
        }
    }));


    app.use(pinoHttp({
        transport: !config.isProduction
            ? {target: "pino-pretty", options: {colorize: true}}
            : undefined,
        level: config.isProduction ? "warn" : "debug"
    }))

    //Додаємо мідлвару для cors
    app.use(cors);

    //Додаємо основний маршрут
    app.use("/api", appRouter);

    //Додаємо мідлвару для обробки помилок
    app.use(errorHandler.handle);

    return app;
}