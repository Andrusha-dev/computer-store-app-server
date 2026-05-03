import {z} from "zod";
import {arrayPreprocess} from "../../../../../shared/utils/validation.utils.ts";


//export const GRAPHIC_CARD_PRODUCERS = ["NVIDIA", "AMD", "INTEL"] as const;
//export const graphicCardProducerSchema = z.enum(GRAPHIC_CARD_PRODUCERS);
//export type GraphicCardProducer = z.infer<typeof graphicCardProducerSchema>;


export const PCIE_TYPES = ["PCIE_2.0", "PCIE_3.0", "PCIE_4.0", "PCIE_5.0"] as const;
export const pcieTypeSchema = z.enum(PCIE_TYPES);
export type PcieType = z.infer<typeof pcieTypeSchema>;

export const VIDEO_MEMORY_CAPACITIES = [1, 2, 4, 8, 16, 32, 64, 128] as const;
export const videoMemoryCapacitySchema = z
    .coerce
    .number()
    .int()
    .refine((value) => VIDEO_MEMORY_CAPACITIES.includes(value as any), {
        error: "Неприпустиме значення відеопам\'яті. Оберіть одне з дозволених значень"
    });
export type VideoMemoryCapacity = z.infer<typeof videoMemoryCapacitySchema>;


export const graphicCardSchema = z.object({
    //graphicCardProducer: graphicCardProducerSchema,
    pcieType: pcieTypeSchema,
    GPUClockGHz: z.number().int().positive({error: "Частота GPU має бути цілим додатнім числом"}),
    videoMemoryClockGHz: z.number().int().positive({error: "Частота відеопам\'яті має бути цілим додатнім числом"}),
    videoMemoryCapacityGB: videoMemoryCapacitySchema,
    HDMIExist: z.boolean(),
    DVIExist: z.boolean(),
    rtxSupport: z.boolean(),
})
export type GraphicCard = z.infer<typeof graphicCardSchema>;

export const graphicCardFiltersSchema = z.object({
    //graphicCardProducer: z.preprocess(arrayPreprocess, z.array(graphicCardProducerSchema)).optional(),
    pcieType: z.preprocess(arrayPreprocess, z.array(pcieTypeSchema)).optional(),
    videoMemoryCapacityGB: z.preprocess(arrayPreprocess, z.array(videoMemoryCapacitySchema)).optional(),
});
export type GraphicCardFilters = z.infer<typeof graphicCardFiltersSchema>;


