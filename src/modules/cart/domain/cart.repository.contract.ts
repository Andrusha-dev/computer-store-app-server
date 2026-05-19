import type {CartEntity, CartFullEntity} from "./cart.entity.ts";
import {Prisma} from "@prisma/client";


export interface ICartRepository {
    findById: (id: number) => Promise<CartEntity | null>;
    findFullById: (id: number) => Promise<CartFullEntity | null>;
    findMany: (args: Prisma.CartFindManyArgs) => Promise<CartEntity[]>;
    count: (where?: Prisma.CartWhereInput) => Promise<number>;
    create: (data: Prisma.CartCreateInput) => Promise<CartFullEntity>;
    update: (id: number, data: Prisma.CartUpdateInput) => Promise<CartFullEntity>;
    delete: (id: number) => Promise<CartFullEntity>;
}

