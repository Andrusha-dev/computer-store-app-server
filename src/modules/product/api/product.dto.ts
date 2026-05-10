import {
    baseProductSchema, categorySchema,
    productFiltersSchema, productSchema, productSortTypeSchema
} from "./schemas/product.schema.ts";
import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema.ts";
import {graphicCardSchema} from "./schemas/pcComponents/graphic-card.schema.ts";
import {memorySchema} from "./schemas/pcComponents/memory.schema.ts";
import {motherboardSchema} from "./schemas/pcComponents/motherboard.schema.ts";
import {processorSchema} from "./schemas/pcComponents/processor.schema.ts";
import {powerSupplySchema} from "./schemas/pcComponents/power-supply.schema.ts";
import {storageSchema} from "./schemas/pcComponents/storage.schema.ts";





//INPUT
//Базова схема dto для мутацій
const baseProductDtoSchema = baseProductSchema.omit({id: true});

export const createProductDtoSchema = z.discriminatedUnion("category", [
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.MEMORY), details: memorySchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.PROCESSORS), details: processorSchema}),
    baseProductDtoSchema.extend({category: z.literal(categorySchema.enum.STORAGE), details: storageSchema}),
]);
export type CreateProductDto = z.infer<typeof createProductDtoSchema>;


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


//Базова схема response, що містить реляції
const baseProductFullResponseSchema = baseProductSchema.extend({
    producer: producerResponseSchema,
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



