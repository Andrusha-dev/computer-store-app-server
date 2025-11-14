import type {Category, PCComponent} from "./pcComponent.types";


export type storageProducer = "Seagate" | "Toshiba" | "Western Digital" | "Samsung" | "HP" | "ADATA";
export type StorageType = "HDD" | "SSD" | "NVMe";
export type StorageInterface = "SATA" | "SATA2" | "SATA3" | "M.2" | "PCIe";

export interface StorageOptions {
    producer: storageProducer;
    storageType: StorageType;
    storageInterface: StorageInterface;
    storageCapacityGb: number;
    storageCashGb: number;
    storageSpeedMbPs: number;
}

export interface StorageTypes extends PCComponent {
    category: Extract<Category, "storage">;
    storageOptions: StorageOptions
}