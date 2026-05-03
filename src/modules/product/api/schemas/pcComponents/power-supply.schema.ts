import {z} from "zod";
import {arrayPreprocess} from "../../../../../shared/utils/validation.utils.ts";


//export const POWER_SUPPLY_PRODUCERS = ["GIGABYTE", "SEASONIC", "CHIEFTEC", "COOLER_MASTER", "DEEP_COOL"] as const;
//export const powerSupplyProducerSchema = z.enum(POWER_SUPPLY_PRODUCERS);
//export type powerSupplyProducer = z.infer<typeof powerSupplyProducerSchema>;

export const POWER_SUPPLY_PLACINGS = ["BELOW", "ABOVE"] as const;
export const powerSupplyPlacingSchema = z.enum(POWER_SUPPLY_PLACINGS);
export type PowerSupplyPlacing = z.infer<typeof powerSupplyPlacingSchema>;

export const CERTIFICATION_80_PLUS = ["BRONZE", "SILVER", "GOLD", "PLATINUM"] as const;
export const certification80PlusSchema = z.enum(CERTIFICATION_80_PLUS);
export type Certification80Plus = z.infer<typeof certification80PlusSchema>;


export const powerSupplySchema = z.object({
    //powerSupplyProducer: powerSupplyProducerSchema,
    powerSupplyCapacityW: z.coerce.number().int().positive({error: "Потужність блока живлення має бути цілим додатнім числом"}),
    certification80Plus: certification80PlusSchema,
    powerSupplyPlacing: powerSupplyPlacingSchema,
    numberOfSataWires: z.coerce.number().int().nonnegative({error: "Кількість кабелів SATA не може бути від\'ємним числом"}),
    numberOfMolexWires: z.coerce.number().int().nonnegative({error: "Кількість кабелів Molex не може бути від\'ємним числом"}),
    numberOfPcieWires: z.coerce.number().int().nonnegative({error: "Кількість кабелів PCIe не може бути від\'ємним числом"}),
})
export type PowerSupply = z.infer<typeof powerSupplySchema>;

export const powerSupplyFiltersSchema = z.object({
    //powerSupplyProducer: z.preprocess(arrayPreprocess, z.array(powerSupplyProducerSchema)).optional(),
    certification80Plus: z.preprocess(arrayPreprocess, z.array(certification80PlusSchema)).optional(),
    powerSupplyPlacing: z.preprocess(arrayPreprocess, z.array(powerSupplyPlacingSchema)).optional(),
});
export type PowerSupplyFilters = z.infer<typeof powerSupplyFiltersSchema>;

