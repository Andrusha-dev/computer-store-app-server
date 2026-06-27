import type {DeliveryEntity} from "../domain/delivery.entity";
import {type DeliveryResponse, deliveryResponseSchema} from "./delivery.dto";



export const toDeliveryResponse =
    (delivery: DeliveryEntity): DeliveryResponse => {
        const transformedDelivery = {
            ...delivery
        }

        const response: DeliveryResponse = deliveryResponseSchema.parse(transformedDelivery);

        return response;
    }