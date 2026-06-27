import type {
    CreateProductDto, ProductFullResponse,
    ProductResponse,
    ProductsQuery,
    ProductsResponse,
    UpdateProductDto
} from "../api/product.dto.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";




export interface IProductService {
    findById: (id: number) => Promise<ProductResponse>;
    findFullById: (id: number) => Promise<ProductFullResponse>
    findMany: (query: ProductsQuery) => Promise<ProductsResponse>;
    create: (dto: CreateProductDto) => Promise<ProductFullResponse>
    update: (id: number, dto: UpdateProductDto) => Promise<ProductFullResponse>
    delete: (id: number) => Promise<ProductFullResponse>;
    decreaseQuantity: (id: number, count: number, tx?: Prisma.TransactionClient) => Promise<void>;
    increaseQuantity: (id: number, count: number, tx?: Prisma.TransactionClient) => Promise<ProductFullResponse>;
}