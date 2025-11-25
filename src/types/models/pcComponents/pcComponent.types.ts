

export type Category = "processors" | "memory" | "storage" | "graphicCards" | "motherboards" | "powerSupplies"

export interface PCComponent {
    id: number;
    componentName: string;
    imgUrls: string[];
    price: number;
    description: string;
    quantity: number;
    category: Category;
}
//Загальні фільтри для всіх компонентів
export interface PCComponentFilters {
    minPrice?: number;
    maxPrice?: number;
}