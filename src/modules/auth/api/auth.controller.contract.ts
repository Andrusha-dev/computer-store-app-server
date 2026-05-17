import type {Request, Response} from "express";
import type {AuthResponse} from "./auth.dto.ts";


export interface IAuthController {
    login: (req: Request, res: Response<AuthResponse>) => Promise<void>;
    refresh: (req: Request, res: Response<AuthResponse>) => Promise<void>;
}