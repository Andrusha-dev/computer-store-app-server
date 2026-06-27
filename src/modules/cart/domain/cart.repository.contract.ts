import type {CartFullEntity} from "./cart.entity.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";



export interface ICartRepository {
    findCartFullByUserId: (userId: number) => Promise<CartFullEntity | null>;
    createItem: (userId: number, productId: number, quantity: number) => Promise<CartFullEntity>;
    updateItemQuantity: (userId: number, productId: number, quantity: number) => Promise<CartFullEntity>;
    deleteItem: (userId: number, productId: number) => Promise<CartFullEntity>;
    clearCart: (userId: number, tx?: Prisma.TransactionClient) => Promise<void>;
}

