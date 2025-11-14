import type {Category, PCComponent} from "./pcComponent.types";

export type powerSupplyProducer = "Gigabyte" | "Seasonic" | "Chieftec" | "Cooler Master" | "DeepCool";
export type PowerSupplyPlacing = "below" | "above";
export type Certification80Plus = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface PowerSupplyOptions {
    producer: powerSupplyProducer;
    powerSupplyCapacityW: number;
    certification80Plus: Certification80Plus;
    powerSupplyPlacing: PowerSupplyPlacing;
    numberOfSataWires: number;
    numberOfMolexWires: number;
    numberOfPcieWires: number;
}

export interface PowerSupply extends PCComponent {
    category: Extract<Category, "powerSupplies">;
    powerSupplyOptions: PowerSupplyOptions;
}