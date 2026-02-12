import type {NextFunction, Request, Response} from "express";


//middleware для налаштування cors
export const cors = (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Обробка попередніх запитів (Preflight requests)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
}