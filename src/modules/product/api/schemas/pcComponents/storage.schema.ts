import {z} from "zod";
import {arrayPreprocess} from "../../../../../shared/utils/validation.utils.ts";


//export const STORAGE_PRODUCERS = ["SEAGATE", "TOSHIBA", "WESTERN_DIGITAL", "SAMSUNG", "HP", "ADATA"] as const;
//export const storageProducerSchema = z.enum(STORAGE_PRODUCERS);
//export type storageProducer = z.infer<typeof storageProducerSchema>;

export const STORAGE_TYPES = ["HDD", "SSD", "NVME"] as const;
export const storageTypeSchema = z.enum(STORAGE_TYPES);
export type StorageType = z.infer<typeof storageTypeSchema>;

export const STORAGE_INTERFACES = ["SATA", "SATA2", "SATA3", "M.2", "PCIE"] as const;
export const storageInterfaceSchema = z.enum(STORAGE_INTERFACES);
export type StorageInterface = z.infer<typeof storageInterfaceSchema>;


export const storageSchema = z.object({
    //storageProducer: storageProducerSchema,
    storageType: storageTypeSchema,
    storageInterface: storageInterfaceSchema,
    storageCapacityGb: z.coerce.number().int().positive({error: "Об\'єм накопичувача має бути цілим додатнім числом"}),
    storageCashGb: z.coerce.number().int().positive({error: "Об\'єм кешу накопичувача має бути цілим додатнім числом"}),
    storageSpeedMbPs: z.coerce.number().int().positive({error: "Швидкість накопичувача має бути цілим додатнім числом"}),
})
export type Storage = z.infer<typeof storageSchema>;

export const storageFiltersSchema = z.object({
    //storageProducer: z.preprocess(arrayPreprocess, z.array(storageProducerSchema)).optional(),
    storageType: z.preprocess(arrayPreprocess, z.array(storageTypeSchema)).optional(),
    storageInterface: z.preprocess(arrayPreprocess, z.array(storageInterfaceSchema)).optional(),
})

