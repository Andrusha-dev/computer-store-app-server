import type {CartFullEntity} from "../domain/cart.entity";
import {type CartFullResponse, cartFullResponseSchema} from "./cart.dto";


export const toCartFullResponse =
    (cart: CartFullEntity): CartFullResponse => {
        const transformedCart = {
            ...cart
        };

        const response: CartFullResponse = cartFullResponseSchema.parse(transformedCart);

        return response;
    }