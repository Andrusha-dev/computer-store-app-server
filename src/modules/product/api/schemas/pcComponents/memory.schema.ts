import {z} from "zod";
import {arrayPreprocess} from "../../../../../shared/utils/validation.utils.ts";


//export const MEMORY_PRODUCERS = ["SAMSUNG", "CORSAIR", "G.SKILL", "KINGSTON", "PNY", "TRANSCEND"] as const;
//export const memoryProducerSchema = z.enum(MEMORY_PRODUCERS);
//export type MemoryProducer = z.infer<typeof memoryProducerSchema>;

export const MEMORY_TYPES = ["DDR2", "DDR3", "DDR4", "DDR5"] as const;
export const memoryTypeSchema = z.enum(MEMORY_TYPES);
export type MemoryType = z.infer<typeof memoryTypeSchema>;

const MEMORY_CAPACITIES = [2, 4, 8, 16, 32, 64, 128] as const;
export const memoryCapacitySchema = z
    .coerce
    .number()
    .int()
    .refine((value) => MEMORY_CAPACITIES.includes(value as any), {
        error: `Об\'єм пам\'яті має відповідати дозволеним значенням: ${MEMORY_CAPACITIES}`
    })
export type MemoryCapacity = z.infer<typeof memoryCapacitySchema>;

const NUMBERS_OF_CHANNELS = [1, 2] as const;
export const numberOfChannelsSchema = z
    .coerce
    .number()
    .int()
    .refine((value) => NUMBERS_OF_CHANNELS.includes(value as any), {
        error: `Кількість каналів має відповідати дозволеним значенням: ${NUMBERS_OF_CHANNELS}`
    })
export type NumberOfChannels = z.infer<typeof numberOfChannelsSchema>;



export const memorySchema = z.object({
    //memoryProducer: memoryProducerSchema,
    memoryType: memoryTypeSchema,
    memoryCapacityGB: memoryCapacitySchema,
    memoryFrequencyGHz: z.number().positive({error: "Частота пам\'яті має бути додатнім числом"}),
    timingScheme: z.string().min(10, {error: "довжина схеми таймінгів має бути не менше 10 символів"}),
    numberOfChannels: numberOfChannelsSchema,
})
export type Memory = z.infer<typeof memorySchema>;

export const memoryFiltersSchema = z.object({
    //memoryProducer: z.preprocess(arrayPreprocess, z.array(memoryProducerSchema)).optional(),
    memoryType: z.preprocess(arrayPreprocess, z.array(memoryTypeSchema)).optional(),
    memoryCapacityGB: z.preprocess(arrayPreprocess, z.array(memoryCapacitySchema)).optional(),
    numberOfChannels: z.preprocess(arrayPreprocess, z.array(numberOfChannelsSchema)).optional(),
})

