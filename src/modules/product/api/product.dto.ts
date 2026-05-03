import {
    productFiltersSchema, productSchema, productSortTypeSchema
} from "./schemas/product.schema.ts";
import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema.ts";





//INPUT
export const createProductDtoSchema = z.discriminatedUnion(
    "category",
    productSchema.options.map((option) => option.omit({id: true})) as any
);
export type CreateProductDto = z.infer<typeof createProductDtoSchema>;


export const updateProductDtoSchema = z.discriminatedUnion(
    "category",
    productSchema.options.map((option) => option
        .omit({id: true})
        .partial()
        .extend({
            category: option.shape.category,
        })
    ) as any
);
export type UpdateProductDto = z.infer<typeof updateProductDtoSchema>;


export const productParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export type ProductParams = z.infer<typeof productParamsSchema>;


export const productsQuerySchema = paginationCriteriaSchema
    .extend({
        sortType: productSortTypeSchema
    })
    .extend(productFiltersSchema.shape);
export type ProductsQuery = z.infer<typeof productsQuerySchema>;




//OUTPUT
export const productResponseSchema = productSchema;
export type ProductResponse = z.infer<typeof productResponseSchema>;

export const productFullResponseSchema = z.discriminatedUnion("category",
    productSchema.options.map(option => option.extend({
        producer: producerResponseSchema // Використовуємо саме RESPONSE версію
    })) as any
);
export type ProductFullResponse = z.infer<typeof productFullResponseSchema>;

export const productsResponseSchema = z.object({
    content: z.array(productResponseSchema),
    meta: paginationMetaSchema,
});
export type ProductsResponse = z.infer<typeof productsResponseSchema>;



