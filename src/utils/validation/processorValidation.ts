import {z} from "zod";
import {type FetchProcessorsParams} from "../../types/params/processorParams.types.ts";
import type {SortOrder, SortType} from "../../types/params/pageParams.types.ts";
import type {
    NumberOfCores,
    NumberOfThreads,
    ProcessorProducer,
    ProcessorSocket
} from "../../types/models/pcComponents/processor.types.ts";


const ProcessorProducerSchema: z.ZodType<ProcessorProducer> = z.enum(["Intel", "AMD"]);
const ProcessorSocketSchema: z.ZodType<ProcessorSocket> = z.enum(["LGA1700", "LGA1200", "LGA1151", "LGA1150", "LGA1155", "AM5", "AM4", "AM3", "AM2"]);
const NumberOfCoresSchema: z.ZodType<NumberOfCores> = z.enum(["2cores", "4cores", "6cores", "8cores"]);
const NumberOfThreadsSchema: z.ZodType<NumberOfThreads> = z.enum(["2threads", "4threads", "6threads", "8threads", "12threads", "16threads"]);
const SortTypeSchema: z.ZodType<SortType> = z.enum(["price", "quantity"]);
const SortOrderSchema: z.ZodType<SortOrder> = z.enum(["asc", "desc"]);

// Допоміжна функція для перетворення одиночних значень в масив перед валідацією
const arrayPreprocess = (val: unknown) => {
    if (val === undefined) return undefined;
    if (Array.isArray(val)) return val;
    return [val];
};

export const FetchProcessorsParamsSchema: z.ZodType<FetchProcessorsParams> = z.object({
    minPrice: z.coerce.number().nonnegative("min price should be a positive number").optional(),
    maxPrice: z.coerce.number().positive("max price should be a positive number").optional(),
    producer: z.preprocess(arrayPreprocess, z.array(ProcessorProducerSchema).optional()),
    processorSocket: z.preprocess(arrayPreprocess, z.array(ProcessorSocketSchema).optional()),
    numberOfCores: z.preprocess(arrayPreprocess, z.array(NumberOfCoresSchema).optional()),
    numberOfThreads: z.preprocess(arrayPreprocess, z.array(NumberOfThreadsSchema).optional()),
    pageNo: z.coerce.number().int().min(0, "pageNo should be a non-negative integer").optional(),
    pageSize: z.coerce.number().int().positive("pageSize should be a positive integer").optional(),
    sortType: SortTypeSchema.optional(),
    sortOrder: SortOrderSchema.optional(),
});