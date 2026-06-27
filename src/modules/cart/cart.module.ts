import type {ICartRepository} from "./domain/cart.repository.contract";
import type {ICartService} from "./application/cart.service.contract";
import {asClass, asFunction} from "awilix";
import {CartRepository} from "./infrastructure/database/cart.repository";
import {CartService} from "./application/cart.service";
import {CartController} from "./api/cart.controller";
import {type CartRouter, createCartRouter} from "./api/cart.router";



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