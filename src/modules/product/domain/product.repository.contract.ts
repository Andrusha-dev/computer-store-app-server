import type {ProductEntity} from "./product.entity.ts";
import {Prisma} from "@prisma/client";



export interface  IProductRepository {
    findById(id: number): Promise<ProductEntity | null>;
    findMany(args: Prisma.ProductFindManyArgs): Promise<ProductEntity[]>;
    count(where: Prisma.ProductWhereInput): Promise<number>;
    create(data: Prisma.ProductCreateInput): Promise<ProductEntity>;
    update(id: number, data: Prisma.ProductUpdateInput): Promise<ProductEntity>;
    delete(id: number): Promise<ProductEntity>;
}