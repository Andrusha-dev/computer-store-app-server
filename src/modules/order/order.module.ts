import type {IOrderRepository} from "./domain/order.repository.contract";
import type {IOrderService} from "./application/order.service.contract";
import {asClass, asFunction} from "awilix";
import {OrderService} from "./application/order.service";
import {OrderController} from "./api/order.controller";
import {createOrderRouter, type OrderRouter} from "./api/order.router";
import {OrderRepository} from "./infrastructure/database/order.repository";



export interface IOrderModuleCradle {
    orderRepository: IOrderRepository;
    orderService: IOrderService;
    orderController: OrderController;
    orderRouter: OrderRouter;
}

export const orderModuleDeps = {
    orderRepository: asClass(OrderRepository).singleton(),
    orderService: asClass(OrderService).singleton(),
    orderController: asClass(OrderController).singleton(),
    orderRouter: asFunction(createOrderRouter).singleton()
}