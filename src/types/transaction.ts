export interface Transaction {
    id: number,
    userId: number,
    type: "income" | "expense",
    category: string,
    amount: number,
    date: string,
    note?: string
}