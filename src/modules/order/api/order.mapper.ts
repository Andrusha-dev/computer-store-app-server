import type {OrderFullEntity} from "../domain/order.entity.ts";
import {
    type OrderFullResponse,
    orderFullResponseSchema,
    type OrdersResponse,
    ordersResponseSchema
} from "./order.dto.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";




export const toOrderFullResponse =
    (order: OrderFullEntity): OrderFullResponse => {
        const transformedOrder = {
            ...order
        }

        const response: OrderFullResponse = orderFullResponseSchema.parse(transformedOrder);

        return response;
    }

export const toOrdersResponse =
    (content: OrderFullResponse[], meta: PaginationMeta): OrdersResponse => {
        const response = {
            content: content,
            meta: meta
        }

        const validatedResponse: OrdersResponse = ordersResponseSchema.parse(response);

        return validatedResponse;
    }