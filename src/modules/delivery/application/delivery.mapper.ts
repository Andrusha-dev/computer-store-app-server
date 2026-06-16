import type {CreateDeliveryDto} from "../api/delivery.dto.ts";
import {Prisma} from "@prisma/client";


export const toDeliveryCreateWithoutOrderInput =
    (totalAmount: number, dto: CreateDeliveryDto): Prisma.DeliveryCreateWithoutOrderInput => {
        let price: number = 0;

        if(dto.method === "COURIER" && totalAmount < 1000) {
            price = 100;
        }

        const data: Prisma.DeliveryCreateWithoutOrderInput = {
            method: dto.method,
            details: dto.details,
            price: price
        }

        return data;
    }