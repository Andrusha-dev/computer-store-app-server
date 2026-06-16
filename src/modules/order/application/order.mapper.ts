import {Prisma} from "@prisma/client";
import type {CreateOrderDto, OrderFilters, OrdersQuery, UpdateOrderStatusDto} from "../api/order.dto.ts";
import {orderInclude} from "../domain/order.entity.ts";
import {toPaymentCreateWithoutOrderInput} from "../../payment/application/payment.mapper.ts";
import {toDeliveryCreateWithoutOrderInput} from "../../delivery/application/delivery.mapper.ts";



export const toOrderWhereInput =
    (filters: OrderFilters, userId?: number): Prisma.OrderWhereInput => {
        const where: Prisma.OrderWhereInput = {
            status: filters.status,
            userId: userId,
        }

        return where;
    }

//В маппері, на відміну від сервісу, можна створювати опціональні параметри
export const toOrderFindManyArgs =
    (query: OrdersQuery, userId?: number): Prisma.OrderFindManyArgs => {
        const {pageNo, pageSize, sortType, sortOrder, ...filters} = query;

        //userId є опціональним аргументом, тому admin отримає всі замовлення, а користувач - лише власні
        const where: Prisma.OrderWhereInput = toOrderWhereInput(filters, userId);

        const args: Prisma.OrderFindManyArgs = {
            where: where,
            orderBy: {
                [sortType]: sortOrder
            },
            take: pageSize,
            skip: pageNo * pageSize,
            //Обовязково вказуєм include. Order має бути з items
            include: orderInclude
        }

        return args;
    }

export const toOrderCreateInput =
    (
        userId: number,
        totalAmount: number,
        orderItems: Prisma.OrderItemCreateWithoutOrderInput[],
        dto: CreateOrderDto
    ): Prisma.OrderCreateInput => {
        const data: Prisma.OrderCreateInput = {
            status: "PENDING",
            totalAmount: totalAmount,
            items: {
                create: orderItems
            },
            user: {
                connect: {id: userId}
            },
            payment: {
                create: toPaymentCreateWithoutOrderInput(totalAmount, dto.payment)
            },
            delivery: {
                create: toDeliveryCreateWithoutOrderInput(totalAmount, dto.delivery, )
            }
        }

        return data;
    }

export const toOrderUpdateInput =
    (dto: UpdateOrderStatusDto): Prisma.OrderUpdateInput => {
        const data: Prisma.OrderUpdateInput = {
            ...dto
        }

        return data;
    }