import type {Request, Response} from "express";
import type {UserFullResponse, UserResponse, UsersResponse} from "./user.dto.ts";

export interface IUserController {
    findById: (req: Request, res: Response<UserResponse>) => Promise<void>;
    findFullById: (req: Request, res: Response<UserFullResponse>) => Promise<void>;
    findMany: (req: Request, res: Response<UsersResponse>) => Promise<void>;
    create: (req: Request, res: Response<UserFullResponse>) => Promise<void>;
    update: (req: Request, res: Response<UserFullResponse>) => Promise<void>;
    delete: (req: Request, res: Response<UserFullResponse>) => Promise<void>;
}