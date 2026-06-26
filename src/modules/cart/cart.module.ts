import type {ICartRepository} from "./domain/cart.repository.contract.ts";
import type {ICartService} from "./application/cart.service.contract.ts";
import {asClass, asFunction} from "awilix";
import {CartRepository} from "./infrastructure/database/cart.repository.ts";
import {CartService} from "./application/cart.service.ts";
import {CartController} from "./api/cart.controller.ts";
import {type CartRouter, createCartRouter} from "./api/cart.router.ts";


export interface ICartModuleCradle {
    cartRepository: ICartRepository,
    cartService: ICartService,
    cartController: CartController,
    cartRouter: CartRouter,
}

export const cartModuleDeps = {
    cartRepository: asClass(CartRepository).singleton(),
    cartService: asClass(CartService).singleton(),
    cartController: asClass(CartController).singleton(),
    cartRouter: asFunction(createCartRouter).singleton(),
}