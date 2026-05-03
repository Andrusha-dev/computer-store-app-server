import {z} from "zod";

export const graphicCardProducerSchema = z.enum(["NVIDIA", "AMD", "INTEL"]);
export type GraphicCardProducer = z.infer<typeof graphicCardProducerSchema>;

export const pcieTypeSchema = z.enum(["PCIE_2.0", "PCIE_3.0", "PCIE_4.0", "PCIE_5.0"]);
export type PcieType = z.infer<typeof pcieTypeSchema>;

const allowedVideoMemoryCapacity = [1, 2, 4, 8, 16, 32, 64, 128];
export const videoMemoryCapacitySchema = z
    .number()
    .int()
    .refine((value) => allowedVideoMemoryCapacity.includes(value), {
        error: "Неприпустиме значення відеопам\'яті. Оберіть одне з дозволених значень"
    });
export type VideoMemoryCapacity = z.infer<typeof videoMemoryCapacitySchema>;


export const graphicCardSchema = z.object({
    graphicCardProducer: graphicCardProducerSchema,
    pcieType: pcieTypeSchema,
    GPUClock: z.number().positive(),
    memoryClock: z.number().positive(),
    videoMemoryCapacity: videoMemoryCapacitySchema,
    HDMIExist: z.boolean(),
    DVIExist: z.boolean(),
    rtxSupport: z.boolean(),
})
export type GraphicCard = z.infer<typeof graphicCardSchema>;


