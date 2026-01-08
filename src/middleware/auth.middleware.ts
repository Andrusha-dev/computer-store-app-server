import type {NextFunction, Request, Response} from "express";
import {validateAccessToken} from "../services/authService.ts";
import type {TokenPayload} from "../types/dto/authDTO.types.ts";
import type {UserRole} from "../types/models/user.ts";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    try {
        const payload = validateAccessToken(accessToken);
        res.locals.payload = payload;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

export const authorizeRole = (roles: UserRole[]) =>
    (req: Request, res: Response, next: NextFunction) => {
        const payload: TokenPayload = res.locals.payload as TokenPayload;
        if(!payload || !payload.role) {
            return res.status(403).json({ message: "Forbiden: No role in payload" });
        }

        const userRole: UserRole = payload.role;
        const hasNecessaryRole: boolean = roles.includes(userRole);
        if(!hasNecessaryRole) {
            return res.status(403).json({ message: "Forbiden: Such role is not enough" });
        }

        next();
    };