import {Prisma} from "@prisma/client";
import type {OrderFilters, OrdersQuery} from "../api/order.dto.ts";
import {orderInclude} from "../domain/order.entity.ts";



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