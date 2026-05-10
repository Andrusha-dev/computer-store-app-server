import type {IProductRepository} from "./domain/product.repository.contract.ts";
import type {IProductService} from "./application/product.service.contract.ts";
import type {IProductController} from "./api/product.controller.contract.ts";
import type {Router} from "express";
import {asClass, asFunction} from "awilix";
import {ProductRepository} from "./infrastructure/database/product.repository.ts";
import {ProductService} from "./application/product.service.ts";
import {ProductController} from "./api/product.controller.ts";
import {createProductRouter} from "./api/product.router.ts";


export interface IProductModuleCradle {
    productRepository: IProductRepository;
    productService: IProductService;
    productController: IProductController;
    productRouter: Router;
}


export const productModuleDeps = {
    productRepository: asClass(ProductRepository).singleton(),
    productService: asClass(ProductService).singleton(),
    productController: asClass(ProductController).singleton(),
    productRouter: asFunction(createProductRouter).singleton(),
}