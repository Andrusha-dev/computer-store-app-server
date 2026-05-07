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
export const createProductDtoSchema = z.discriminatedUnion("category", [
    baseProductSchema
        .omit({id: true})
        .extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema}),
    baseProductSchema
        .omit({id: true})
        .extend({category: z.literal(categorySchema.enum.MEMORY), details: memorySchema}),
    baseProductSchema
        .omit({id: true})
        .extend({category: z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema}),
    baseProductSchema
        .omit({id: true})
        .extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema}),
    baseProductSchema
        .omit({id: true})
        .extend({category: z.literal(categorySchema.enum.PROCESSORS), details: processorSchema}),
    baseProductSchema
        .omit({id: true})
        .extend({category: z.literal(categorySchema.enum.STORAGE), details: storageSchema}),
]);
export type CreateProductDto = z.infer<typeof createProductDtoSchema>;


export const updateProductDtoSchema = z.discriminatedUnion("category", [
    baseProductSchema
        .omit({id: true})
        .extend({details: graphicCardSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS)}),
    baseProductSchema
        .omit({id: true})
        .extend({details: memorySchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.MEMORY)}),
    baseProductSchema
        .omit({id: true})
        .extend({details: motherboardSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.MOTHERBOARDS)}),
    baseProductSchema
        .omit({id: true})
        .extend({details: powerSupplySchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES)}),
    baseProductSchema
        .omit({id: true})
        .extend({details: processorSchema.partial()})
        .partial()
        .extend({category: z.literal(categorySchema.enum.PROCESSORS)}),
    baseProductSchema
        .omit({id: true})
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



