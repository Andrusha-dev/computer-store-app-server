import {z} from "zod";


//Загальні фільтри для всіх компонентів
export interface PCComponentFilters {
    minPrice?: number;
    maxPrice?: number;
}
/*pcComponentFiltersSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу FetchProcessorsParams, а в Record<string, any>, схема валідації якого відрізнятиметься від схеми валідації
обєкту типу FetchProcessorsParams*/
export const pcComponentFiltersSchema = z.object({
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
});