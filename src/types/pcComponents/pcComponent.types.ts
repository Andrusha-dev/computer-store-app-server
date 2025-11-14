

export type Category = "processors" | "memory" | "storage" | "graphicCards" | "motherboards" | "powerSupplies"

export interface PCComponent {
    id: number;
    componentName: string;
    imgUrls: string[];
    price: number;
    description: string;
    isExist: boolean;
}