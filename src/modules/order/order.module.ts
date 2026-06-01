import type {IOrderRepository} from "./domain/order.repository.contract.ts";
import type {IOrderService} from "./application/order.service.contract.ts";
import type {IOrderController} from "./api/order.controller.contract.ts";
import type {Router} from "express";
import {asClass, asFunction} from "awilix";
import {OrderService} from "./application/order.service.ts";
import {OrderController} from "./api/order.controller.ts";
import {createOrderRouter} from "./api/order.router.ts";
import {OrderRepository} from "./infrastructure/database/order.repository.ts";


export interface IOrderModuleCradle {
    orderRepository: IOrderRepository;
    orderService: IOrderService;
    orderController: IOrderController;
    orderRouter: Router;
}

export const orderModuleDeps = {
    orderRepository: asClass(OrderRepository).singleton(),
    orderService: asClass(OrderService).singleton(),
    orderController: asClass(OrderController).singleton(),
    orderRouter: asFunction(createOrderRouter).singleton()
}