import type {Request, Response} from "express";
import type {CheckoutResponse, OrderFullResponse, OrdersResponse, RetryPaymentResponse} from "./order.dto.ts";




export interface IOrderController {
    findMyFullById: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    findFullById: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    findMyMany: (req: Request, res: Response<OrdersResponse>) => Promise<void>;
    findMany: (req: Request, res: Response<OrdersResponse>) => Promise<void>;
    create: (req: Request, res: Response<CheckoutResponse>) => Promise<void>;
    retryPayment: (req: Request, res: Response<RetryPaymentResponse>) => Promise<void>;
    //updateStatus: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    setTrackingNumber: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    updateStatusToCompleted: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
    cancelOrder: (req: Request, res: Response<OrderFullResponse>) => Promise<void>;
}