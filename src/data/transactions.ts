import {type Transaction} from "../types/models/transaction.ts";

export const transactions: Transaction[] = [
    {
        id: 1,
        userId: 1,
        type: "income",
        category: "Devidends",
        amount: 32000,
        date: "2025-09-06T09:32:29.529Z",
        note: "Отримання щомісячних девідендів"
    },
    {
        id: 2,
        userId: 2,
        type: "expense",
        category: "Products",
        amount: 2800,
        date: "2025-09-07T12:48:29.529Z",
        note: "Купівля харчових продуктів"
    },
    {
        id: 3,
        userId: 1,
        type: "expense",
        category: "Products",
        amount: 2500,
        date: "2025-09-07T18:24:29.529Z",
        note: "Купівля продуктів"
    },
    {
        id: 4,
        userId: 1,
        type: "income",
        category: "Cellary",
        amount: 124000,
        date: "2025-09-08T12:18:29.529Z",
        note: "Зарплата"
    },
];