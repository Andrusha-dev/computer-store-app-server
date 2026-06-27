import express, {type Router} from "express";
import type { Express} from "express";
import {cors} from "../middlewares/cors.middleware";
import {container} from "../../shared/infrastructure/di/container";
import {errorHandler} from "../middlewares/error.middleware";




export const expressLoader = async ():Promise<Express> => {
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

    app.use(cors);

    const appRouter = container.resolve<Router>("appRouter");
    app.use("/api", appRouter);

    app.use(errorHandler);

    return app;
}