import type {Request, Response} from "express";
import type {OrderFullResponse, OrdersResponse} from "./order.dto.ts";




export interface IOrderController {
    findMyFullById: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    findFullById: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    findMyMany: (req: Request, res: Response<OrdersResponse>) => Promise<void>;
    findMany: (req: Request, res: Response<OrdersResponse>) => Promise<void>;
    create: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    updateStatus: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
}