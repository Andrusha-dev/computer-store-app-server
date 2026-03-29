import {
    pageParamsSchema, pageQueryParamsSchema,
} from "../pageParams/pageParams.types.ts";
import {pcComponentFiltersSchema} from "./pcComponentParams.types.ts";
import {
    numberOfCoresSchema,
    numberOfThreadsSchema,
    processorProducerSchema,
    processorSocketSchema
} from "../../models/pcComponents/processor.types.ts";
import {z} from "zod";
import {arrayPreprocess} from "../../../shared/validation/validation.helpers.ts";




//основний тип для фільтрів списку процесорів в параметрах запиту
/*processorFiltersSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу GetProcessorsCatalogParams, а в Record<string, any>, тому схема валідації мусить попередньо обробляти
поля, які є масивами за допомогою z.preprocess()*/
export const processorFiltersSchema = pcComponentFiltersSchema.extend({
    producer: z.preprocess(arrayPreprocess, z.array(processorProducerSchema).optional()),
    processorSocket: z.preprocess(arrayPreprocess, z.array(processorSocketSchema).optional()),
    numberOfCores: z.preprocess(arrayPreprocess, z.array(numberOfCoresSchema).optional()),
    numberOfThreads: z.preprocess(arrayPreprocess, z.array(numberOfThreadsSchema).optional()),
});
export interface ProcessorFilters extends z.infer<typeof processorFiltersSchema>{}


//Обєднаний тип, на основі ключів інтерфейса ProcessorFilters
export type ProcessorFiltersKeys = keyof ProcessorFilters;


//Тип, в якому параметри запиту GetProcessorsCatalogParams, розділені на групи. При чому цей
//тип передбачає властивість типу PageParams, а не QueryPageParams. Тобто наявність пагінації - обовязкова.
// Використовується в методі parseProcessorParams для парсинга параметрів FetchProcessorsParams до ProcessorFilters та PageParams
export const parsedProcessorsParamsSchema = z.object({
    processorFilters: processorFiltersSchema,
    pageParams: pageParamsSchema
});
export interface ParsedProcessorsParams extends z.infer<typeof parsedProcessorsParamsSchema>{}


//Тип для параметрів запиту в методі getProcessorsCatalog
export const getProcessorsCatalogParamsSchema = processorFiltersSchema.extend(pageQueryParamsSchema.shape);
export interface GetProcessorsCatalogParams extends z.infer<typeof getProcessorsCatalogParamsSchema>{}