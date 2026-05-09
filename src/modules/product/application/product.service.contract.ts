import type {
    CreateProductDto, ProductFullResponse,
    ProductResponse,
    ProductsQuery,
    ProductsResponse,
    UpdateProductDto
} from "../api/product.dto.ts";



export interface IProductService {
    findById: (id: number) => Promise<ProductResponse>;
    findFullById: (id: number) => Promise<ProductFullResponse>
    findMany: (productsQuery: ProductsQuery) => Promise<ProductsResponse>;
    create: (product: CreateProductDto) => Promise<ProductFullResponse>
    update: (id: number, product: UpdateProductDto) => Promise<ProductFullResponse>
    delete: (id: number) => Promise<ProductFullResponse>;
}