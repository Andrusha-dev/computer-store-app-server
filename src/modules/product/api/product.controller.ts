import type {IProductService} from "../application/product.service.contract";
import type {
    CreateProductDto,
    ProductFullResponse, ProductParams,
    ProductResponse,
    ProductsQuery,
    ProductsResponse, UpdateProductDto
} from "./product.dto";
import type {Request, Response} from "express";
import {
    extractValidatedBodyOrThrow,
    extractValidatedParamsOrThrow,
    extractValidatedQueryOrThrow
} from "../../../api/helpers/http.helpers";



interface Dependencies {
    productService: IProductService
}


export class ProductController {
    private readonly productService: IProductService;

    constructor({productService}: Dependencies) {
        this.productService = productService;
    }

    findById = async (req: Request, res: Response<ProductResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<ProductParams>(req);

        const response: ProductResponse = await this.productService.findById(id);

        res.json(response);
    }

    findFullById = async (req: Request, res: Response<ProductFullResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<ProductParams>(req);

        const response: ProductFullResponse = await this.productService.findFullById(id);

        res.json(response);
    }

    findMany = async (req: Request, res: Response<ProductsResponse>): Promise<void> => {
        const query: ProductsQuery = extractValidatedQueryOrThrow<ProductsQuery>(req);

        const response: ProductsResponse = await this.productService.findMany(query);

        res.json(response);
    }

    create = async (req: Request, res: Response<ProductFullResponse>): Promise<void> => {
        const dto: CreateProductDto = extractValidatedBodyOrThrow<CreateProductDto>(req);

        const response: ProductFullResponse = await this.productService.create(dto);

        res.json(response);
    }

    update = async (req: Request, res: Response<ProductFullResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<ProductParams>(req);
        const dto: UpdateProductDto = extractValidatedBodyOrThrow<UpdateProductDto>(req);

        const response: ProductFullResponse = await this.productService.update(id, dto);

        res.json(response);
    }

    delete = async (req: Request, res: Response<ProductFullResponse>): Promise<void> => {
        const {id} = extractValidatedParamsOrThrow<ProductParams>(req);

        const response: ProductFullResponse = await this.productService.delete(id);

        res.json(response);
    }
}