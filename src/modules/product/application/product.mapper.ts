import type {ProductsQuery} from "../api/product.dto.ts";
import {Prisma} from "@prisma/client";
import type {ProductFilters} from "../api/schemas/product.schema.ts";



export const toProductWhereInput = (filters: ProductFilters): Prisma.ProductWhereInput => {
    if(filters.category) {

    }


}

export const toProductFindManyArgs = (query: ProductsQuery): Prisma.ProductFindManyArgs => {
    const args: Prisma.ProductFindManyArgs = {
        where: {

        },
        orderBy: {
            [query.sortType]: query.sortOrder
        },
        take: query.pageSize,
        skip: query.pageNo * query.pageSize,
    }
}