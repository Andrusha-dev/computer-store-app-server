import type {
    CheckoutResponse,
    CreateOrderDto,
    OrderFullResponse,
    OrdersQuery,
    OrdersResponse, RetryPaymentResponse,
    UpdateOrderStatusDto
} from "../api/order.dto.ts";



export interface IOrderService {
    findMyFullById: (userId: number, id: number) => Promise<OrderFullResponse>;
    findFullById: (id: number) => Promise<OrderFullResponse>;//Метод для адмінів
    findMyMany: (userId: number, query: OrdersQuery) => Promise<OrdersResponse>;
    findMany: (query: OrdersQuery) => Promise<OrdersResponse>;//Метод для адмінів
    create: (userId: number, dto: CreateOrderDto) => Promise<CheckoutResponse>;
    retryPayment: (orderId: number, userId: number) => Promise<RetryPaymentResponse>;
    updateStatus: (id: number, dto: UpdateOrderStatusDto) => Promise<OrderFullResponse>;//Метод для адмінів
    setTrackingNumber: (id: number, trackingNumber: string) => Promise<OrderFullResponse>;//Метод для адмінів
    cancelOrder: (id: number) => Promise<OrderFullResponse>;
}