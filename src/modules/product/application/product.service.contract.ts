import type {
    CreateProductDto,
    ProductResponse,
    ProductsQuery,
    ProductsResponse,
    UpdateProductDto
} from "../api/product.dto.ts";


export interface IProductService {
    fetchProductById: (id: number) => Promise<ProductResponse>;
    fetchProducts: (productsQuery: ProductsQuery) => Promise<ProductsResponse>;
    createProduct: (product: CreateProductDto) => Promise<ProductResponse>
    updateProduct: (id: number, product: UpdateProductDto) => Promise<ProductResponse>
    deleteProduct: (id: number) => Promise<void>;
}