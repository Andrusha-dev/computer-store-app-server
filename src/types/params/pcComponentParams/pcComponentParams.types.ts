import {z} from "zod";


//Загальні фільтри для всіх компонентів
export interface PCComponentFilters {
    minPrice?: number;
    maxPrice?: number;
}
/*pcComponentFiltersSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу GetProcessorsCatalogParams, а в Record<string, any>, тому схема валідації має попередньо приводити
поля, які є строками, до необхідного типу за допомогою z.coerce*/
export const pcComponentFiltersSchema = z.object({
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
});