import {type PageParams, pageParamsSchema} from "./pageParams.types.ts";
import {type PCComponentFilters, pcComponentFiltersSchema} from "./pcComponentParams.types.ts";
import {
    type NumberOfCores, numberOfCoresSchema,
    type NumberOfThreads, numberOfThreadsSchema,
    type ProcessorProducer, processorProducerSchema,
    type ProcessorSocket, processorSocketSchema
} from "../models/pcComponents/processor.types.ts";
import {z} from "zod";
import {arrayPreprocess} from "../../utils/validation/processorValidation.ts";


//основний тип для фільтрів списку процесорів Processor[]
export interface ProcessorFilters extends PCComponentFilters {
    producer?: ProcessorProducer[];
    processorSocket?: ProcessorSocket[];
    numberOfCores?: NumberOfCores[];
    numberOfThreads?: NumberOfThreads[];
}
/*processorFiltersSchema відрізняється від аналогічної на клієнті, тому що параметри запиту на сервері парсяться
не в обєкт типу FetchProcessorsParams, а в Record<string, any>, схема валідації якого відрізнятиметься від схеми валідації
обєкту типу FetchProcessorsParams*/
export const processorFiltersSchema = pcComponentFiltersSchema.extend({
    producer: z.preprocess(arrayPreprocess, z.array(processorProducerSchema).optional()),
    processorSocket: z.preprocess(arrayPreprocess, z.array(processorSocketSchema).optional()),
    numberOfCores: z.preprocess(arrayPreprocess, z.array(numberOfCoresSchema).optional()),
    numberOfThreads: z.preprocess(arrayPreprocess, z.array(numberOfThreadsSchema).optional()),
});


//Обєднаний тип, на основі ключів інтерфейса ProcessorFilters
export type ProcessorFiltersKeys = keyof ProcessorFilters;


//Тип для параметрів запиту в методі fetchProcessors
export interface FetchProcessorsParams extends ProcessorFilters, PageParams {}
export const fetchProcessorsParamsSchema = processorFiltersSchema.extend(pageParamsSchema.shape);