import type {ProductEntity, ProductFullEntity} from "../domain/product.entity";
import {
    type ProductFullResponse,
    productFullResponseSchema,
    type ProductResponse,
    productResponseSchema, type ProductsResponse, productsResponseSchema
} from "./product.dto";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema";


export const toProductResponse = (product: ProductEntity): ProductResponse => {
    //Здійснюємо мапінг полів
    const transformedProduct = {
        ...product,
        //додаткові поля, які потребують мапінгу, якщо бізнес тип відрізняється від контракту response
    }

    //Оскільки поле details в ProductEntity має тип JsonValue, то для нього не можна здійснити мапінг.
    //Тому лише схема валідації може перевірити поля в details. Тому обовязково здійснюємо валідацію.
    const response: ProductResponse = productResponseSchema.parse(transformedProduct);

    return response;
}

export const toProductFullResponse = (product: ProductFullEntity): ProductFullResponse => {
    //Здійснюємо мапінг полів
    const transformedProduct = {
        ...product,
        //додаткові поля, які потребують мапінгу, якщо бізнес тип відрізняється від контракту response
    }

    //Оскільки поле details в ProductFullEntity має тип JsonValue, то для нього не можна здійснити мапінг.
    //Тому лише схема валідації може перевірити поля в details. Тому обовязково здійснюємо валідацію.
    const response: ProductFullResponse = productFullResponseSchema.parse(transformedProduct);

    return response;
}

export const toProductsResponse =
    (content: ProductResponse[], meta: PaginationMeta): ProductsResponse => {
        const response: ProductsResponse = {
            content: content,
            meta: meta
        }

        const validatedResponse: ProductsResponse = productsResponseSchema.parse(response);

        return validatedResponse;
    }