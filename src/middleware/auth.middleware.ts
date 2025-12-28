import type {NextFunction, Request, Response} from "express";
import {validateAccessToken} from "../services/authService.ts";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }


    const payload = validateAccessToken(accessToken);
    console.log(payload);


    if (!payload) {
        return res.status(403).json({ message: "Invalid token" });
    }


    next();
};