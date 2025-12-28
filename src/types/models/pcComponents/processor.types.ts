import {
    type Category,
    type PCComponent,
    pcComponentSchema
} from "./pcComponent.types.ts";
import {z} from "zod";



export type ProcessorProducer = "Intel" | "AMD";
export const processorProducerSchema = z.enum(["Intel", "AMD"]);

export type ProcessorSocket = "LGA1700" | "LGA1200" | "LGA1151" | "LGA1150" | "LGA1155" | "AM5" | "AM4" | "AM3" | "AM2";
export const processorSocketSchema = z.enum(["LGA1700", "LGA1200", "LGA1151", "LGA1150", "LGA1155", "AM5", "AM4", "AM3", "AM2"]);

export type NumberOfCores = "2cores" | "4cores" | "6cores" | "8cores";
export const numberOfCoresSchema = z.enum(["2cores", "4cores", "6cores", "8cores"]);

export type NumberOfThreads = "2threads" | "4threads" | "6threads" | "8threads" | "12threads" | "16threads";
export const numberOfThreadsSchema = z.enum(["2threads", "4threads", "6threads", "8threads", "12threads", "16threads"]);


export interface ProcessorOptions {
    producer: ProcessorProducer;
    processorSocket: ProcessorSocket;
    processorFrequencyGHz: number;
    numberOfCores: NumberOfCores;
    numberOfThreads: NumberOfThreads;
    l3cacheMB: number;
}
export const processorOptionsSchema = z.object({
    producer: processorProducerSchema,
    processorSocket: processorSocketSchema,
    processorFrequencyGHz: z.number().positive(),
    numberOfCores: numberOfCoresSchema,
    numberOfThreads: numberOfThreadsSchema,
    l3cacheMB: z.number().positive().int(),
});

export interface Processor extends PCComponent {
    category: Extract<Category, "processors">;
    processorOptions: ProcessorOptions;
}
export const processorSchema = pcComponentSchema.extend({
    category: z.literal("processors"),
    processorOptions: processorOptionsSchema,
});


