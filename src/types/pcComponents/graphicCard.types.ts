import type {Category, PCComponent} from "./pcComponent.types";

export type GraphicCardProducer = "Nvidia" | "AMD" | "Intel";
export type PcieType = "2.0" | "3.0" | "4.0" | "5.0";
export type VideoMemoryCapacity = "1GB" | "2GB" | "4GB" | "8GB" | "16GB" | "32GB" | "64GB" | "128GB";

export interface GraphicCardOptions {
    producer: GraphicCardProducer;
    pcieType: PcieType;
    GPUClockMHz: number;
    memoryClockMHz: number;
    videoMemoryCapacityGb: VideoMemoryCapacity;
    HDMIExist: boolean;
    DVIExist: boolean;
    rtxSupport: boolean;
}

export interface GraphicCard extends PCComponent {
    category: Extract<Category, "graphicCards">;
    graphicCardOptions: GraphicCardOptions;
}