import type {Category, PCComponent} from "./pcComponent.types.ts";
import type {MemoryType} from "./memory.types.ts";
import type {PcieType} from "./graphicCard.types.ts";
import type {ProcessorSocket} from "./processor.types.ts";

export type motherboardProducer = "Asus" | "Gigabyte" | "MSI" | "Asrock";
export type MotherBoardType = "ATX" | "microATX" | "miniATX";
export type NumberOfMemorySlots = "x2" | "x4" | "x8";
export type USBPortsType = "2.0" | "3.0";

export interface MotherboardOptions {
    producer: motherboardProducer;
    motherBoardType: MotherBoardType;
    processorSocket: ProcessorSocket;
    memoryType: MemoryType;
    memorySlots: NumberOfMemorySlots;
    pcieType: PcieType;
    USBPortsType: USBPortsType;
    numberOfUSBPorts: number;
}

export interface Motherboard extends PCComponent {
    category: Extract<Category, "motherboards">;
    motherboardOptions: MotherboardOptions;
}