import {type Request, type Response} from "express";


export interface IPaymentWebhookController {
    handleMonobankWebhook: (req: Request, res: Response) => Promise<void>;
}