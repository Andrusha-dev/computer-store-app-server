import type {Request, Response} from "express";

export interface IUserController {
    me: (req: Request, res: Response) => Promise<any>;
    show: (req: Request, res: Response) => Promise<any>;
    //index: (req: Request, res: Response) => Promise<any>;
    register: (req: Request, res: Response) => Promise<any>;
}