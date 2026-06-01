import type {CartFullResponse, CreateCartItemDto, UpdateCartItemQuantityDto} from "../api/cart.dto.ts";

export interface ICartService {
    findCartFullByUserId: (userId: number) => Promise<CartFullResponse>;
    createItem: (userId: number, dto: CreateCartItemDto) => Promise<CartFullResponse>;
    updateItemQuantity: (userId: number, productId: number, dto: UpdateCartItemQuantityDto) => Promise<CartFullResponse>;
    deleteItem: (userId: number, productId: number) => Promise<CartFullResponse>;
    clearCart: (userId: number) => Promise<CartFullResponse>;
}