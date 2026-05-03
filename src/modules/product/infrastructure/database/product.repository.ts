import type {IProductRepository} from "../../domain/product.repository.contract.ts";
import type {ProductEntity} from "../../domain/product.entity.ts";
import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import {Prisma} from "@prisma/client";


interface Dependencies {
    dbService: PrismaService
}

export class ProductRepository implements IProductRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }


    findById = async (id: number): Promise<ProductEntity | null> => {
        const product: ProductEntity | null = await this.dbService.product.findUnique({
            where: {
                id: id
            }
        });

        return product;
    }

    findMany = async (args: Prisma.ProductFindManyArgs): Promise<ProductEntity[]> => {

    }
}