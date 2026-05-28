import type {CreateOrderDto, OrderFullResponse, OrdersQuery, OrdersResponse, UpdateOrderDto} from "../api/order.dto.ts";



export interface IOrderService {
    findMyFullById: (userId: number, id: number) => Promise<OrderFullResponse>;
    findFullById: (id: number) => Promise<OrderFullResponse>;//Метод для адмінів
    findMyMany: (userId: number, query: OrdersQuery) => Promise<OrdersResponse>;
    findMany: (query: OrdersQuery) => Promise<OrdersResponse>;//Метод для адмінів
    create: (userId: number, dto: CreateOrderDto) => Promise<OrderFullResponse>;
    updateStatus: (id: number, dto: UpdateOrderDto) => Promise<OrderFullResponse>;//Метод для адмінів
}