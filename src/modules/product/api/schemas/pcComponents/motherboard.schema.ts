import {z} from "zod";
import {processorSocketSchema} from "./processor.schema.ts";
import {memoryTypeSchema} from "./memory.schema.ts";
import {pcieTypeSchema} from "./graphic-card.schema.ts";
import {arrayPreprocess} from "../../../../../shared/utils/validation.utils.ts";


//export const MOTHERBOARD_PRODUCERS = ["ASUS", "GIGABYTE", "MSI", "ASROCK"] as const;
//export const motherBoardProducerSchema = z.enum(MOTHERBOARD_PRODUCERS);
//export type MotherboardProducer = z.infer<typeof motherBoardProducerSchema>;

export const MOTHERBOARD_TYPES = ["ATX", "MICRO_ATX", "MINI_ATX"] as const;
export const motherBoardTypeSchema = z.enum(MOTHERBOARD_TYPES);
export type MotherBoardType = z.infer<typeof motherBoardTypeSchema>;

const NUMBERS_OF_MEMORY_SLOTS = [2, 4, 8] as const;
export const numberOfMEmorySlotsSchema = z
    .coerce
    .number()
    .int()
    .refine((value) => NUMBERS_OF_MEMORY_SLOTS.includes(value as any), {
        error: `Число слотів пам\'яті має відповідати дозволеним значенням: ${NUMBERS_OF_MEMORY_SLOTS}`
    })

export type NumberOfMemorySlots = z.infer<typeof numberOfMEmorySlotsSchema>;

export const USB_PORT_TYPES = ["2.0", "3.0"] as const;
export const usbPortTypeSchema = z.enum(USB_PORT_TYPES);
export type UsbPortType = z.infer<typeof usbPortTypeSchema>;


export const motherboardSchema = z.object({
    //motherboardProducer: motherBoardProducerSchema,
    motherboardType: motherBoardTypeSchema,
    processorSocket: processorSocketSchema,
    memoryType: memoryTypeSchema,
    numberOfMemorySlots: numberOfMEmorySlotsSchema,
    pcieType: pcieTypeSchema,
    usbPortsType: usbPortTypeSchema,
    numberOfUsbPorts: z.coerce.number().int().positive({error: "Кількість портів usb має бути цілим додатнім числом"}),
})
export type Motherboard = z.infer<typeof motherboardSchema>;

export const motherboardFiltersSchema = z.object({
    //motherboardProducer: z.preprocess(arrayPreprocess, z.array(motherBoardProducerSchema)).optional(),
    motherboardType: z.preprocess(arrayPreprocess, z.array(motherBoardTypeSchema)).optional(),
    processorSocket: z.preprocess(arrayPreprocess, z.array(processorSocketSchema)).optional(),
    memoryType: z.preprocess(arrayPreprocess, z.array(memoryTypeSchema)).optional(),
    numberOfMEmorySlotsSchema: z.preprocess(arrayPreprocess, z.array(numberOfMEmorySlotsSchema)).optional(),
    pcieType: z.preprocess(arrayPreprocess, z.array(pcieTypeSchema)).optional(),
    usbPortsType: z.preprocess(arrayPreprocess, z.array(usbPortTypeSchema)).optional(),
})

