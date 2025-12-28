import {z} from "zod";


export type Category = "processors" | "memory" | "storage" | "graphicCards" | "motherboards" | "powerSupplies";
export const categorySchema = z.enum(["processors", "memory", "storage", "graphicCards", "motherboards", "powerSupplies"]); // додайте свої категорії

export interface PCComponent {
    id: number;
    componentName: string;
    imgUrls: string[];
    price: number;
    description: string;
    quantity: number;
    category: Category;
}
export const pcComponentSchema = z.object({
    id: z.number(),
    componentName: z.string(),
    imgUrls: z.array(z.string()),
    price: z.number(),
    description: z.string(),
    quantity: z.number(),
    category: categorySchema,
});
