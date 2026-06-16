import type {ProductEntity, ProductFullEntity} from "./product.entity.ts";
import {Prisma} from "@prisma/client";



export interface  IProductRepository {
    findById(id: number): Promise<ProductEntity | null>;
    findFullById(id: number): Promise<ProductFullEntity | null>;
    findMany(args: Prisma.ProductFindManyArgs): Promise<ProductEntity[]>;
    count(where?: Prisma.ProductWhereInput): Promise<number>;
    create(data: Prisma.ProductCreateInput): Promise<ProductFullEntity>;
    update(id: number, data: Prisma.ProductUpdateInput): Promise<ProductFullEntity>;
    delete(id: number): Promise<ProductFullEntity>;
    decreaseQuantityWithCheck(id: number, count: number, tx?: Prisma.TransactionClient): Promise<boolean>;
    //increaseQuantity(id: number, count: number): Promise<ProductFullEntity>;
}