import type {CreateProductDto, ProductsQuery, UpdateProductDto} from "../api/product.dto.ts";
import {Prisma} from "@prisma/client";
import {type Product, type ProductFilters} from "../api/schemas/product.schema.ts";



export const toProductWhereInput =
    (filters: ProductFilters): Prisma.ProductWhereInput => {
        const {
            minPrice, maxPrice, category, producerIds,
            ...categoryFilters
        } = filters;

        const where: Prisma.ProductWhereInput = {}

        if(minPrice !== undefined || maxPrice !== undefined) {
            where.price = {
                gte: minPrice,
                lte: maxPrice,
            }
        }

        if(producerIds?.length) {
            where.producerId = { in: producerIds }
        }

        if(category) {
            where.category = category;
        } else {
            //Якщо фільтр category не вказаний то повертаємо лише where з базовими фільтрами
            return where;
        }


        //Створюємо масив з entries лише для фільтрів категорії, які точно є
        const activeEntries = Object.entries(categoryFilters)
            .filter(([_, value]) => value !== undefined);

        //Додаємо в where фільтри з категорії товару
        if(activeEntries.length) {
            where.AND = activeEntries.map(([key, value]) => ({
                details: {
                    //Значення path обовязково має бути масивом (хоча ts і не викидає помилку, якщо це не масив),
                    //де міститься перелік полів різного рівня вкладеності в json
                    path: [key],
                    equals: value
                }
            }))
        }

        return where;
    }

export const toProductFindManyArgs =
    (query: ProductsQuery): Prisma.ProductFindManyArgs => {
        const {
            sortType, sortOrder, pageNo, pageSize,
            ...filters
        } = query;

        const where: Prisma.ProductWhereInput = toProductWhereInput(filters);

        const args: Prisma.ProductFindManyArgs = {
            where: where,
            orderBy: {
                [sortType]: sortOrder
            },
            take: pageSize,
            skip: pageNo * pageSize,
        }

        return args;
    }

export const toProductCreateInput =
    (createProductDto: CreateProductDto): Prisma.ProductCreateInput => {
        const {producerId, ...rest} = createProductDto;

        const data: Prisma.ProductCreateInput = {
            ...rest,
            producer: {
                connect: {id: producerId}
            }
        }

        return data;
    }

export const toProductUpdateInput =
    (updateProductDto: UpdateProductDto): Prisma.ProductUpdateInput => {
        const {producerId, ...rest} = updateProductDto;

        const data: Prisma.ProductUpdateInput = {
            ...rest,
            producer: producerId ?
                {connect:  {id: producerId} }
                : undefined
        }

        return data;
    }