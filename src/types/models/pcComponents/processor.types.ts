import {z} from "zod";




export const processorProducerSchema = z.enum(["INTEL", "AMD"]);
export type ProcessorProducer = z.infer<typeof processorProducerSchema>;

export const processorSocketSchema = z.enum(["LGA1700", "LGA1200", "LGA1151", "LGA1150", "LGA1155", "AM5", "AM4", "AM3", "AM2"]);
export type ProcessorSocket = z.infer<typeof processorSocketSchema>;

const allowedCoreCount = [2, 4, 6, 8];
export const numberOfCoresSchema = z
    .number()
    .int()
    .refine((value) => allowedCoreCount.includes(value), {
        message: "Неприпустима кількість потоків. Оберіть одне з дозволених значень"
    })
export type NumberOfCores = z.infer<typeof numberOfCoresSchema>;

const allowedThreadCount = [2, 4, 6, 8, 12, 16];
export const numberOfThreadsSchema = z
    .number()
    .int()
    .refine((value) => allowedThreadCount.includes(value), {
        error: "Неприпустима кількість потоків. Оберіть одне з дозволених значень"
    })
export type NumberOfThreads = z.infer<typeof numberOfThreadsSchema>;


export const processorSchema = z.object({
    producer: processorProducerSchema,
    processorSocket: processorSocketSchema,
    processorFrequencyGHz: z.number().positive(),
    numberOfCores: numberOfCoresSchema,
    numberOfThreads: numberOfThreadsSchema,
    l3cacheMB: z.number().int().positive(),
});
export type Processor = z.infer<typeof processorSchema>;



