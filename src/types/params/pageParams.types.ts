import {z} from "zod";
import {type PCComponentSortType, pcComponentSortTypeSchema} from "../models/pcComponents/pcComponent.types.ts";
import {type UserSortType, userSortTypeSchema} from "../models/user.ts";



//Загальний тип для сортування. При формування обєкту з параметрами сторінки - буде передаватись
// більш вузькоспеціалізований тип, залежно від сутності, яка сортується (ProcessorSortType, UserSortType і т.д.)
export type SortType = UserSortType | PCComponentSortType;
export const sortTypeSchema = z.union([userSortTypeSchema, pcComponentSortTypeSchema]);

export type SortOrder = "asc" | "desc";
export const sortOrderSchema = z.enum(["asc", "desc"]);


export interface PageParams{
    pageNo: number;
    pageSize: number;
    sortType: SortType;
    sortOrder: SortOrder;
}

//Тип параметрів для запитів з використанням пагінації та сортування
export type QueryPageParams = Partial<PageParams>;
/*queryPageParamsSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу FetchProcessorsParams, а в Record<string, any>, схема валідації якого відрізнятиметься від схеми валідації
обєкту типу FetchProcessorsParams*/
export const queryPageParamsSchema = z.object({
    pageNo: z.coerce.number().int().nonnegative().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
    sortType: sortTypeSchema.optional(),
    sortOrder: sortOrderSchema.optional(),
});
