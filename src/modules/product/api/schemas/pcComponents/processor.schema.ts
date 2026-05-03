import {z} from "zod";
import {arrayPreprocess} from "../../../../../shared/utils/validation.utils.ts";



//export const PROCESSOR_PRODUCERS = ["INTEL", "AMD"] as const;
//export const processorProducerSchema = z.enum(PROCESSOR_PRODUCERS);
//export type ProcessorProducer = z.infer<typeof processorProducerSchema>;

export const PROCESSOR_SOCKETS = ["LGA1700", "LGA1200", "LGA1151", "LGA1150", "LGA1155", "AM5", "AM4", "AM3", "AM2"] as const;
export const processorSocketSchema = z.enum(PROCESSOR_SOCKETS);
export type ProcessorSocket = z.infer<typeof processorSocketSchema>;

export const NUMBERS_OF_CORES = [2, 4, 6, 8] as const;
export const numberOfCoresSchema = z
    .coerce
    .number()
    .int()
    .refine((value) => NUMBERS_OF_CORES.includes(value as any), {
        message: `Неприпустима кількість потоків. Оберіть одне з дозволених значень: ${NUMBERS_OF_CORES}`
    })
export type NumberOfCores = z.infer<typeof numberOfCoresSchema>;

export const NUMBERS_OF_THREADS = [2, 4, 6, 8, 12, 16] as const;
export const numberOfThreadsSchema = z
    .coerce
    .number()
    .int()
    .refine((value) => NUMBERS_OF_THREADS.includes(value as any), {
        error: "Неприпустима кількість потоків. Оберіть одне з дозволених значень"
    })
export type NumberOfThreads = z.infer<typeof numberOfThreadsSchema>;


export const processorSchema = z.object({
    //processorProducer: processorProducerSchema,
    processorSocket: processorSocketSchema,
    processorFrequencyGHz: z.number().positive({error: "Частота процесора має бути додатнім числом"}),
    numberOfCores: numberOfCoresSchema,
    numberOfThreads: numberOfThreadsSchema,
    l3cacheMB: z.coerce.number().int().positive({error: "Кеш 3-го рівня має бути додатнім цілим числом"}),
});
export type Processor = z.infer<typeof processorSchema>;

export const processorFiltersSchema = z.object({
    //processorProducer: z.preprocess(arrayPreprocess, z.array(processorProducerSchema)).optional(),
    processorSocket: z.preprocess(arrayPreprocess, z.array(processorSocketSchema)).optional(),
    numberOfCores: z.preprocess(arrayPreprocess, z.array(numberOfCoresSchema)).optional(),
    numberOfThreads: z.preprocess(arrayPreprocess, z.array(numberOfThreadsSchema)).optional(),
})



