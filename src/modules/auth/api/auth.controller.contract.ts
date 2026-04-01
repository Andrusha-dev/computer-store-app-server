import type {Request, Response} from "express";


export interface IAuthController {
    login: (req: Request, res: Response) => Promise<any>;
    refresh: (req: Request, res: Response) => Promise<any>;
}