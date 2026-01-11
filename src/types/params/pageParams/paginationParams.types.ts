import {z} from "zod";

export interface PaginationParams {
    pageNo: number;
    pageSize: number;
}
/*paginationParamsSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт з параметрами, а в Record<string, any>, схема валідації якого відрізнятиметься від схеми валідації
обєкту з параметрами*/
export const paginationParamsShema = z.object({
    pageNo: z.coerce.number().int().nonnegative(),
    pageSize: z.coerce.number().int().positive()
});