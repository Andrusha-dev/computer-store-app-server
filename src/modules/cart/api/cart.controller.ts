import type {Request, Response} from "express";
import type {ICartService} from "../application/cart.service.contract.ts";
import type {IProductService} from "../../product";
import type {ICartController} from "./cart.controller.contract.ts";
import type {CartFullResponse, CartItemParams, CreateCartItemDto, UpdateCartItemQuantityDto} from "./cart.dto.ts";
import {
    extractTokenPayloadOrThrow, extractValidatedBodyOrThrow, extractValidatedParamsOrThrow
} from "../../../api/helpers/http.helpers.ts";




interface Dependencies {
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

    findMyCartFullByUserId =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);

            const response: CartFullResponse = await this.cartService.findCartFullByUserId(id);

            res.json(response);
        }

    createItem =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);
            const dto: CreateCartItemDto = extractValidatedBodyOrThrow<CreateCartItemDto>(req);

            //Переконуємося, що product з отриманим productId справді існує. Інакше генерується помилка
            await this.productService.findById(dto.productId);

            const response: CartFullResponse = await this.cartService.createItem(id, dto);

            res.json(response);
        }

    updateItemQuantity =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);
            const {productId} = extractValidatedParamsOrThrow<CartItemParams>(req);
            const dto: UpdateCartItemQuantityDto = extractValidatedBodyOrThrow<UpdateCartItemQuantityDto>(req);

            //Переконуємося, що product за отриманим productId справді існує. Інакше генерується помилка
            await this.productService.findById(productId);

            const response: CartFullResponse = await this.cartService.updateItemQuantity(id, productId, dto);

            res.json(response);
        }

    deleteItem =
        async (req: Request, res: Response<CartFullResponse>): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);
            const {productId} = extractValidatedParamsOrThrow<CartItemParams>(req);

            //Для видалення CartItem нам не потрібно знати чи існує товар з необхідним id
            const response: CartFullResponse = await this.cartService.deleteItem(id, productId);

            res.json(response);
        }

    clearCart =
        async (req: Request, res: Response): Promise<void> => {
            const {id} = extractTokenPayloadOrThrow(req);

            await this.cartService.clearCart(id);

            res.status(200);
        }
}