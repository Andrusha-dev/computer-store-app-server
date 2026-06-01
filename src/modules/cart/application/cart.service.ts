import type {ICartRepository} from "../domain/cart.repository.contract.ts";
import type {CartFullResponse, CreateCartItemDto, UpdateCartItemQuantityDto} from "../api/cart.dto.ts";
import type {CartFullEntity} from "../domain/cart.entity.ts";
import {toCartFullResponse} from "../api/cart.mapper.ts";
import {NotFoundError} from "../../../shared/error/custom.errors.ts";
import type {ICartService} from "./cart.service.contract.ts";



interface Dependencies {
    cartRepository: ICartRepository;
}

export class CartService implements ICartService {
    private readonly cartRepository: ICartRepository;

    constructor({cartRepository}: Dependencies) {
        this.cartRepository = cartRepository;
    }

    findCartFullByUserId =
        async (userId: number): Promise<CartFullResponse> => {
            const cart: CartFullEntity | null = await this.cartRepository.findCartFullByUserId(userId);

            if(!cart) {
                throw new NotFoundError(`Кошик для користувача з ID ${userId} не знайдено`);
            }

            const response: CartFullResponse = toCartFullResponse(cart);

            return response;
        }

    createItem =
        //При створенні CartItem productId передається через dto
        async (userId: number, dto: CreateCartItemDto): Promise<CartFullResponse> => {
            const cart: CartFullEntity = await this.cartRepository.createItem(userId, dto.productId, dto.quantity);

            const response: CartFullResponse = toCartFullResponse(cart);

            return response;
        }

    updateItemQuantity =
        //При оновленні CartItem productId береться з параметру url і передається як окремий аргумент. dto містить лише quantity
        async (userId: number, productId: number, dto: UpdateCartItemQuantityDto): Promise<CartFullResponse> => {
            const cart: CartFullEntity = await this.cartRepository.updateItemQuantity(userId, productId, dto.quantity);

            const response: CartFullResponse = toCartFullResponse(cart);

            return response;
        }

    deleteItem =
        async (userId: number, productId: number): Promise<CartFullResponse> => {
            const cart: CartFullEntity = await this.cartRepository.deleteItem(userId, productId);

            const response: CartFullResponse = toCartFullResponse(cart);

            return response;
        }

    clearCart =
        async (userId: number): Promise<CartFullResponse> => {
            const cart: CartFullEntity = await this.cartRepository.clearCart(userId);

            const response: CartFullResponse = toCartFullResponse(cart);

            return response;
        }
}

