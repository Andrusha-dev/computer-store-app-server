import type {IProductRepository} from "./domain/product.repository.contract";
import type {IProductService} from "./application/product.service.contract";
import {asClass, asFunction} from "awilix";
import {ProductRepository} from "./infrastructure/database/product.repository";
import {ProductService} from "./application/product.service";
import {ProductController} from "./api/product.controller";
import {createProductRouter, type ProductRouter} from "./api/product.router";



export interface IProductModuleCradle {
    productRepository: IProductRepository;
    productService: IProductService;
    productController: ProductController;
    productRouter: ProductRouter;
}


export const productModuleDeps = {
    productRepository: asClass(ProductRepository).singleton(),
    productService: asClass(ProductService).singleton(),
    productController: asClass(ProductController).singleton(),
    productRouter: asFunction(createProductRouter).singleton(),
}