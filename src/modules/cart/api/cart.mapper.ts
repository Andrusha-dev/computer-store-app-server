import type {CartFullEntity} from "../domain/cart.entity.ts";
import {type CartFullResponse, cartFullResponseSchema} from "./cart.dto.ts";


export const toCartFullResponse =
    (cart: CartFullEntity): CartFullResponse => {
        const transformedCart = {
            ...cart
        };

        const response: CartFullResponse = cartFullResponseSchema.parse(transformedCart);

        return response;
    }