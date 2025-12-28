import {z} from "zod";


export type SortType = "price" | "quantity";
export const sortTypeSchema = z.enum(["price", "quantity"]);

export type SortOrder = "asc" | "desc";
export const sortOrderSchema = z.enum(["asc", "desc"]);



//Тип параметрів для запитів з використанням пагінації та сортування
export interface PageParams {
    pageNo?: number;
    pageSize?: number;
    sortType?: SortType;
    sortOrder?: SortOrder;
}
/*pageParamsSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу FetchProcessorsParams, а в Record<string, any>, схема валідації якого відрізнятиметься від схеми валідації
обєкту типу FetchProcessorsParams*/
export const pageParamsSchema = z.object({
    pageNo: z.coerce.number().int().nonnegative().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
    sortType: sortTypeSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
});
