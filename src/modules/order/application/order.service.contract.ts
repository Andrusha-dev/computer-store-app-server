import type {
    CheckoutResponse,
    CreateOrderDto,
    OrderFullResponse,
    OrdersQuery,
    OrdersResponse, RetryPaymentResponse,
} from "../api/order.dto.ts";



export interface IOrderService {
    findMyFullById: (userId: number, id: number) => Promise<OrderFullResponse>;
    findFullById: (id: number) => Promise<OrderFullResponse>;//Метод для адмінів
    findMyMany: (userId: number, query: OrdersQuery) => Promise<OrdersResponse>;
    findMany: (query: OrdersQuery) => Promise<OrdersResponse>;//Метод для адмінів
    create: (userId: number, dto: CreateOrderDto) => Promise<CheckoutResponse>;
    retryPayment: (orderId: number, userId: number) => Promise<RetryPaymentResponse>;
    setTrackingNumber: (id: number, trackingNumber: string) => Promise<OrderFullResponse>;//Метод для адмінів
    updateStatusToPaid: (id: number) => Promise<OrderFullResponse>;//Метод для вебхуку монобанку в PaymentService
    updateStatusToCompleted: (id: number) => Promise<OrderFullResponse>;//метод для адмінів для зміни статусу замовлення на COMPLETE після отримання товару
    cancelOrder: (id: number) => Promise<OrderFullResponse>;
}