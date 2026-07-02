import {type NextFunction, type Request, type Response} from "express";
import {BadRequestError, ForbiddenError} from "../../../shared/error/custom.errors";
import type {IPaymentProvider} from "../domain/payment.provider.contract";



export interface IMonobankMiddleware {
    verify: (req: Request, res: Response, next: NextFunction) => void;
}

interface Dependencies {
    paymentProvider: IPaymentProvider;
}

//Мідлвара для валідації вебхука монобанку (за принципом алгоритмів на еліптичних кривих ECDSA)
export class MonobankMiddleware implements IMonobankMiddleware {
    private readonly paymentProvider: IPaymentProvider;

    constructor({paymentProvider}: Dependencies) {
        this.paymentProvider = paymentProvider;
    }

    verify = (req: Request, res: Response, next: NextFunction): void => {
        const xSign = req.headers["x-sign"];
        if (!xSign || typeof xSign !== "string") {
            throw new BadRequestError("Отримано вебхук від Монобанку без заголовка x-sign!")
        }

        const rawBody = req.rawBody;
        if (!rawBody) {
            throw new BadRequestError("Тіло запиту відсутнє");
        }


        const isValid = this.paymentProvider.verifyWebhookSignature(rawBody, xSign);
        if (!isValid) {
            throw new ForbiddenError("Підпис X-Sign не збігається!");
        }

        next();
    }
}


