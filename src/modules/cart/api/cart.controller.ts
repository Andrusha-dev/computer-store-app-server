import type {Request, Response} from "express";
import type {ICartService} from "../application/cart.service.contract.ts";
import type {IProductService, ProductResponse} from "../../product";
import type {ICartController} from "./cart.controller.contract.ts";
import type {CartFullResponse, CartItemParams, CreateCartItemDto, UpdateCartItemDto} from "./cart.dto.ts";
import {
    extractTokenPayloadOrThrow,
    extractValidatedBodyOrThrow,
    extractValidatedParamsOrThrow
} from "../../../api/helpers/http.helpers.ts";




export interface Dependencies {
    cartService: ICartService;
    productService: IProductService
}

export class CartController implements ICartController {
    private readonly cartService: ICartService;
    private readonly productService: IProductService;

    constructor({cartService, productService}: Dependencies) {
        this.cartService = cartService;
        this.productService = productService;
    }

    findCartFullByUserId =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(res);

            const response: CartFullResponse = await this.cartService.findCartFullByUserId(id);

            res.json(response);
        }

    createItem =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(res);
            const {productId, quantity} = extractValidatedBodyOrThrow<CreateCartItemDto>(res);

            //Переконуємося, що product з отриманим id справді існує
            const product: ProductResponse = await this.productService.findById(productId);

            const response: CartFullResponse = await this.cartService.createItem(id, product.id, quantity);

            res.json(response);
        }

    updateItemQuantity =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(res);
            const {productId} = extractValidatedParamsOrThrow<CartItemParams>(res);
            const {quantity} = extractValidatedBodyOrThrow<UpdateCartItemDto>(res);

            const product: ProductResponse = await this.productService.findById(productId);

            const response: CartFullResponse = await this.cartService.updateItemQuantity(id, product.id, quantity);

            res.json(response);
        }

    deleteItem =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(res);
            const {productId} = extractValidatedParamsOrThrow<CartItemParams>(res);

            //Для видалення CartItem нам не потрібно знати чи існує товар з необхідним id

            const response: CartFullResponse = await this.cartService.deleteItem(id, productId);

            res.json(response);
        }

    clearCart =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(res);

            const response: CartFullResponse = await this.cartService
                .clearCart(id);

            res.json(response);
        }
}