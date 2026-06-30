import type { Express } from "express";
import {databaseLoader} from "./database.loader";
import {expressLoader} from "./express.loader";
import {container} from "../../shared/infrastructure/di/container";
import type {ILoggerService} from "../../shared/contracts/logger.contract";



//Головний loader
export const initLoaders = async (): Promise<Express> => {
    const logger = container.resolve<ILoggerService>("logger");

    logger.info("🛠️  Initializing layers...");

    //Спочатку база (якщо вона впаде, далі йти немає сенсу)
    await databaseLoader();
    logger.info("✅ Database connected");

    //Потім Express
    const app = await expressLoader();
    logger.info("✅ Express configured");

    logger.info("🚀 All systems GO!");

    return app;
};