import {z} from "zod";
import {processorSchema} from "./processor.types.ts";
import {graphicCardSchema} from "./graphicCard.types.ts";


//Тип для категорій товарів
export const categorySchema = z.enum(["PROCESSORS", "MEMORY", "STORAGE", "GRAPHIC_CARDS", "MOTHERBOARDS", "POWER_SUPPLIES"]); // додайте свої категорії
export type Category = z.infer<typeof categorySchema>;

//Загальний тип для товарів зі спільними полями для будь-якої категорії товару
export const productSchema = z.object({
    id: z.number(),
    componentName: z.string(),
    imgUrls: z.array(z.string()),
    price: z.number(),
    description: z.string(),
    quantity: z.number(),
    category: categorySchema,
});
export type Product = z.infer<typeof productSchema>;


//Тип для способу сортування товарів
export const productSortTypeSchema = productSchema
    .pick({price: true, quantity: true})
    .keyof()
export type ProductSortType = z.infer<typeof productSortTypeSchema>;


export const pcComponentSchema = z.discriminatedUnion("category", [
    z.object({
        ...productSchema.shape,
        category: z.literal(categorySchema.enum.PROCESSORS),
        details: processorSchema,
    }),
    z.object({
        ...productSchema.shape,
        category: z.literal(categorySchema.enum.GRAPHIC_CARDS),
        details: graphicCardSchema,
    }),

]);
export type PCComponent = z.infer<typeof pcComponentSchema>;