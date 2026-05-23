import type {CartFullResponse} from "../api/cart.dto.ts";

export interface ICartService {
    findCartFullByUserId: (userId: number) => Promise<CartFullResponse>;
    createItem: (userId: number, productId: number, quantity: number) => Promise<CartFullResponse>;
    updateItemQuantity: (userId: number, productId: number, quantity: number) => Promise<CartFullResponse>;
    deleteItem: (userId: number, productId: number) => Promise<CartFullResponse>;
    clearCart: (userId: number) => Promise<CartFullResponse>;
}