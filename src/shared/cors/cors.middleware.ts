import type {NextFunction, Request, Response} from "express";
import {config} from "../../config/index.ts";



//middleware для налаштування cors
export const cors = (req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', config.allowedOrigin.url);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Обробка попередніх запитів (Preflight requests)
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }

    next();
}