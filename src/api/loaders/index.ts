import type { Express } from "express";
import {databaseLoader} from "./database.loader";
import {expressLoader} from "./express.loader";



//Головний loader
export const initLoaders = async (): Promise<Express> => {
    console.log("🛠️  Initializing layers...");

    //Спочатку база (якщо вона впаде, далі йти немає сенсу)
    await databaseLoader();
    console.log("✅ Database connected");

    //Потім Express
    const app = await expressLoader();
    console.log("✅ Express configured");

    console.log("🚀 All systems GO!");

    return app;
};