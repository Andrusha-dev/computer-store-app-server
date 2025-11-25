import type {Category, PCComponent} from "./pcComponent.types.ts";


export type MemoryProducer = "samsung" | "Corsair" | "G.SKILL" | "Kingston" | "PNY" | "Transcend";
export type MemoryType = "DDR2" | "DDR3" | "DDR4" | "DDR5";
export type MemoryCapacityGB = "2GB" | "4GB" | "8GB" | "16GB" | "32GB" | "64GB" | "128GB";
export type NumberOfChannels = `1channel` | "2channel";

export interface MemoryOptions {
    producer: MemoryProducer;
    memoryType: MemoryType;
    memoryCapacityGB: MemoryCapacityGB;
    memoryFrequencyMHz: number;
    timingScheme: string;
    numberOfChannels: NumberOfChannels;
}

export interface Memory extends PCComponent {
    category: Extract<Category, "memory">;
    memoryOptions: MemoryOptions;
}