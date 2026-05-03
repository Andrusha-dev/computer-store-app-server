import {z} from "zod";
import {processorFiltersSchema, processorSchema} from "./pcComponents/processor.schema.ts";
import {memoryFiltersSchema, memorySchema} from "./pcComponents/memory.schema.ts";
import {storageFiltersSchema, storageSchema} from "./pcComponents/storage.schema.ts";
import {graphicCardFiltersSchema, graphicCardSchema} from "./pcComponents/graphic-card.schema.ts";
import {motherboardFiltersSchema, motherboardSchema} from "./pcComponents/motherboard.schema.ts";
import {powerSupplyFiltersSchema, powerSupplySchema} from "./pcComponents/power-supply.schema.ts";
import {arrayPreprocess} from "../../../../shared/utils/validation.utils.ts";


//БАЗОВІ СХЕМИ
//Тип для категорій товарів
export const PRODUCT_CATEGORIES = ["PROCESSORS", "MEMORY", "STORAGE", "GRAPHIC_CARDS", "MOTHERBOARDS", "POWER_SUPPLIES"] as const;
export const categorySchema = z.enum(PRODUCT_CATEGORIES); // додайте свої категорії
export type Category = z.infer<typeof categorySchema>;


//Базовий тип для product зі спільними полями для будь-якої категорії товару
export const baseProductSchema = z.object({
    id: z.number(),
    productName: z.string(),
    imgUrls: z.array(z.string()),
    price: z.coerce.number().positive().max(10),
    description: z.string(),
    quantity: z.coerce.number().int().nonnegative({error: "Кількість товару не може бути від\'ємним числом"}),
    category: categorySchema,
    producerId: z.coerce.number().int().positive(),
});
export type BaseProduct = z.infer<typeof baseProductSchema>;

export const baseProductFiltersSchema = z.object({
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    category: categorySchema.optional(),
    producerIds: z.preprocess(arrayPreprocess, z.array(z.coerce.number().int().positive())).optional(),
});
export type BaseProductFilters = z.infer<typeof baseProductFiltersSchema>;



//ОСНОВНІ СХЕМИ
//Основна схема product
export const productSchema = z.discriminatedUnion("category", [
    baseProductSchema.extend({category: z.literal(categorySchema.enum.PROCESSORS), details: processorSchema}),
    baseProductSchema.extend({category: z.literal(categorySchema.enum.MEMORY), details: memorySchema}),
    baseProductSchema.extend({category: z.literal(categorySchema.enum.STORAGE), details: storageSchema}),
    baseProductSchema.extend({category: z.literal(categorySchema.enum.GRAPHIC_CARDS), details: graphicCardSchema}),
    baseProductSchema.extend({category: z.literal(categorySchema.enum.MOTHERBOARDS), details: motherboardSchema}),
    baseProductSchema.extend({category: z.literal(categorySchema.enum.POWER_SUPPLIES), details: powerSupplySchema})
]);
export type Product = z.infer<typeof productSchema>;

//Тип фільтрів product
export  const productFiltersSchema = baseProductFiltersSchema
    .extend(processorFiltersSchema.shape)
    .extend(memoryFiltersSchema.shape)
    .extend(storageFiltersSchema.shape)
    .extend(graphicCardFiltersSchema.shape)
    .extend(motherboardFiltersSchema.shape)
    .extend(powerSupplyFiltersSchema.shape);
export type ProductFilters = z.infer<typeof productFiltersSchema>;

//Тип для способу сортування сутності product
export const productSortTypeSchema = baseProductSchema
    .pick({price: true, quantity: true})
    .keyof()
    .default("price");
export type ProductSortType = z.infer<typeof productSortTypeSchema>;
