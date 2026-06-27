import {
    baseProductSchema, categorySchema,
    productFiltersSchema, productSchema, productSortTypeSchema
} from "./schemas/product.schema";
import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema";
import {graphicCardSchema} from "./schemas/pcComponents/graphic-card.schema";
import {memorySchema} from "./schemas/pcComponents/memory.schema";
import {motherboardSchema} from "./schemas/pcComponents/motherboard.schema";
import {processorSchema} from "./schemas/pcComponents/processor.schema";
import {powerSupplySchema} from "./schemas/pcComponents/power-supply.schema";
import {storageSchema} from "./schemas/pcComponents/storage.schema";
import {producerResponseSchema} from "../../producer/index";





//INPUT
//Базова схема dto для мутацій
const baseProductDtoSchema = baseProductSchema.omit({id: true});


//Схема dto для створення product
export const createProductDtoSchema = z.discriminatedUnion("category", [
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.MEMORY), details: memorySchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.PROCESSORS), details: processorSchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.STORAGE), details: storageSchema}),
]);
export type CreateProductDto = z.infer<typeof createProductDtoSchema>;


//Схема dto для оновлення product. Всі поля опціональні окрім category
export const updateProductDtoSchema = z.discriminatedUnion("category", [
    baseProductDtoSchema
        .extend({details: graphicCardSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS)}),
    baseProductDtoSchema
        .extend({details: memorySchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.MEMORY)}),
    baseProductDtoSchema
        .extend({details: motherboardSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.MOTHERBOARDS)}),
    baseProductDtoSchema
        .extend({details: powerSupplySchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES)}),
    baseProductDtoSchema
        .extend({details: processorSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.PROCESSORS)}),
    baseProductDtoSchema
        .extend({details: storageSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.STORAGE)}),
]);
export type UpdateProductDto = z.infer<typeof updateProductDtoSchema>;


//Схема для параметрів url
export const productParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export type ProductParams = z.infer<typeof productParamsSchema>;


//Схема для параметрів запиту
export const productsQuerySchema = paginationCriteriaSchema
    .extend({
        sortType: productSortTypeSchema
    })
    .extend(productFiltersSchema.shape);
export type ProductsQuery = z.infer<typeof productsQuerySchema>;





//OUTPUT
export const productResponseSchema = productSchema;
export type ProductResponse = z.infer<typeof productResponseSchema>;


//Базова схема response, що містить реляції
const baseProductFullResponseSchema = baseProductSchema.extend({
    producer: z.lazy(() => producerResponseSchema),
});
export const productFullResponseSchema = z.discriminatedUnion("category", [
    baseProductFullResponseSchema.extend({category: z.literal(categorySchema.enum.PROCESSORS), details: processorSchema}),
    baseProductFullResponseSchema.extend({category: z.literal(categorySchema.enum.MEMORY), details: memorySchema}),
    baseProductFullResponseSchema.extend({category: z.literal(categorySchema.enum.STORAGE), details: storageSchema}),
    baseProductFullResponseSchema.extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema}),
    baseProductFullResponseSchema.extend({category: z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema}),
    baseProductFullResponseSchema.extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema,})
]);
export type ProductFullResponse = z.infer<typeof productFullResponseSchema>;


export const productsResponseSchema = z.object({
    content: z.array(productResponseSchema),
    meta: paginationMetaSchema,
});
export type ProductsResponse = z.infer<typeof productsResponseSchema>;



