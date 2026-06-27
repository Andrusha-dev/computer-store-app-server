import type {IOrderService} from "../application/order.service.contract";
import type {Request, Response} from "express";
import type {
    CheckoutResponse,
    CreateOrderDto,
    OrderFullResponse,
    OrderParams,
    OrdersQuery,
    OrdersResponse, RetryPaymentResponse, SetTrackingNumberDto
} from "./order.dto";
import {
    extractTokenPayloadOrThrow, extractValidatedBodyOrThrow,
    extractValidatedParamsOrThrow,
    extractValidatedQueryOrThrow
} from "../../../api/helpers/http.helpers";
import type {TokenPayload} from "../../../shared/schemas/token-payload.schema";




interface Dependencies {
    orderService: IOrderService;
}

export class OrderController {
    private readonly orderService: IOrderService;

    constructor({orderService}: Dependencies) {
        this.orderService = orderService;
    }

    findMyFullById =
        async (req: Request, res: Response<OrderFullResponse>): Promise<void> => {
            const tokenPayload: TokenPayload = extractTokenPayloadOrThrow(req);
            const params: OrderParams = extractValidatedParamsOrThrow<OrderParams>(req)

            const response: OrderFullResponse = await this.orderService.findMyFullById(tokenPayload.id, params.id);

            res.json(response);
        }

    findFullById =
        async (req: Request, res: Response<OrderFullResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<OrderParams>(req)

            const response: OrderFullResponse = await this.orderService.findFullById(id);

            res.json(response);
        }

    findMyMany =
        async (req: Request, res: Response<OrdersResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);
            const query: OrdersQuery = extractValidatedQueryOrThrow<OrdersQuery>(req);

            const response: OrdersResponse = await this.orderService.findMyMany(id, query);

            res.json(response);
        }

    findMany =
        async (req: Request, res: Response<OrdersResponse>): Promise<void> => {
            const query: OrdersQuery = extractValidatedQueryOrThrow<OrdersQuery>(req);

            const response: OrdersResponse = await this.orderService.findMany(query);

            res.json(response);
        }

    create =
        async (req: Request, res: Response<CheckoutResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);
            const dto: CreateOrderDto = extractValidatedBodyOrThrow<CreateOrderDto>(req);

            const response: CheckoutResponse = await this.orderService.create(id, dto);

            res.json(response)
        }

    //Повторна спроба ініціалізації оплати в Монобанку (для користувача)
    retryPayment =
        async (req: Request, res: Response<RetryPaymentResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<OrderParams>(req);
            const tokenPayload: TokenPayload = extractTokenPayloadOrThrow(req);

            const response: RetryPaymentResponse = await this.orderService.retryPayment(id, tokenPayload.id);

            res.json(response);
        }

    //Додавання ТТН та переведення замовлення в статус DELIVERING (для адмінів)
    setTrackingNumber =
        async (req: Request, res: Response<OrderFullResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<OrderParams>(req);
            const {trackingNumber} = extractValidatedBodyOrThrow<SetTrackingNumberDto>(req);

            const response: OrderFullResponse = await this.orderService.setTrackingNumber(id, trackingNumber);

            res.json(response);
        }

    //Зміна статусу замовлення на COMPLETED після отримання користувачем (метод для адмінів)
    updateStatusToCompleted =
        async (req: Request, res: Response<OrderFullResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<OrderParams>(req);

            const response: OrderFullResponse = await this.orderService.updateStatusToCompleted(id);

            res.json(response);
        }

    //Скасування замовлення (виключно для методу оплати CASH). Метод для адмінів
    cancelOrder =
        async (req: Request, res: Response<OrderFullResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<OrderParams>(req);

            const response: OrderFullResponse = await this.orderService.cancelOrder(id);

            res.json(response);
        }
}

