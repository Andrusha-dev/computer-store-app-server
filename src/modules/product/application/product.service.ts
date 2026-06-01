import type {IProductService} from "./product.service.contract.ts";
import type {IProductRepository} from "../domain/product.repository.contract.ts";
import {
    type CreateProductDto,
    type ProductFullResponse,
    type ProductResponse,
    type ProductsQuery,
    type ProductsResponse, type UpdateProductDto
} from "../api/product.dto.ts";
import type {ProductEntity, ProductFullEntity} from "../domain/product.entity.ts";
import {BadRequestError, NotFoundError} from "../../../shared/error/custom.errors.ts";
import {toProductFullResponse, toProductResponse, toProductsResponse} from "../api/product.mapper.ts";
import {Prisma} from "@prisma/client";
import {
    toProductCreateInput,
    toProductFindManyArgs,
    toProductUpdateInput,
} from "./product.mapper.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";
import {createPaginationMeta} from "../../../shared/utils/pagination.utils.ts";


interface Dependencies {
    productRepository: IProductRepository
}

export class ProductService implements IProductService {
    private readonly productRepository: IProductRepository;

    constructor({productRepository}: Dependencies) {
        this.productRepository = productRepository;
    }

    findById =
        async (id: number): Promise<ProductResponse> => {
            const product: ProductEntity | null = await this.productRepository.findById(id);

            if(!product) {
                throw new NotFoundError(`Товар з ID ${id} не знайдено`)
            }

            const response: ProductResponse = toProductResponse(product);

            return response;
        }

    findFullById =
        async (id: number): Promise<ProductFullResponse> => {
            const product: ProductFullEntity | null = await this.productRepository.findFullById(id);

            if (!product) {
                throw new NotFoundError(`Товар з ID ${id} не знайдено`)
            }

            const response: ProductFullResponse = toProductFullResponse(product);

            return response;
        }

    findMany =
        async (query: ProductsQuery): Promise<ProductsResponse> => {
            const args: Prisma.ProductFindManyArgs = toProductFindManyArgs(query);

            const [products, totalElements] = await Promise.all([
                this.productRepository.findMany(args),
                this.productRepository.count(args.where)
            ]);

            const content: ProductResponse[] = products.map(toProductResponse);
            const meta: PaginationMeta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);

            const response: ProductsResponse = toProductsResponse(content, meta);

            return response;
        }

    create =
        async (dto: CreateProductDto): Promise<ProductFullResponse> => {
            const data: Prisma.ProductCreateInput = toProductCreateInput(dto);

            const product: ProductFullEntity = await this.productRepository.create(data);

            const response: ProductFullResponse = toProductFullResponse(product);

            return response;
        }

    update =
        async (id: number, dto: UpdateProductDto): Promise<ProductFullResponse> => {
            let finalDto: UpdateProductDto = {...dto};

            //Під час оновлення запису в бд якщо в полі json були змінені лише деякі поля,
            //потрібно все одно передавати весь обєкт json разом з полями, які не змінювались,
            //оскільки поле json повністю перезаписується даними, які йому передають
            if(dto.details) {
                const existingProduct: ProductResponse = await this.findById(id);

                finalDto.details = {
                    ...existingProduct.details,
                    ...dto.details,
                }
            }

            const data: Prisma.ProductUpdateInput = toProductUpdateInput(finalDto);

            const product: ProductFullEntity = await this.productRepository.update(id, data);

            const response: ProductFullResponse = toProductFullResponse(product);

            return response;
        }

    delete =
        async (id: number): Promise<ProductFullResponse> => {
            const product: ProductFullEntity = await this.productRepository.delete(id);

            const response: ProductFullResponse = toProductFullResponse(product);

            return response;
        }

    //Метод для зменшення кількості товару (списання). Використовується під час оформлення замовлення
    decreaseQuantity =
        async (id: number, count: number): Promise<ProductFullResponse> => {
            const isUpdated: boolean = await this.productRepository.decreaseQuantityWithCheck(id, count);

            if(!isUpdated) {
                throw new BadRequestError(`Неможливо списати товар з ID ${id}: недостатньо на складі`);
            }

            const response: ProductFullResponse = await this.findFullById(id);

            return response;
        }

    //Метод для відкату списання товару, у випадку, якщо під час створення замовлення виникла помилка
    increaseQuantity =
        async (id: number, count: number): Promise<ProductFullResponse> => {
            const product: ProductFullEntity = await this.productRepository.increaseQuantity(id, count);

            const response: ProductFullResponse = toProductFullResponse(product);

            return response;
        }
}