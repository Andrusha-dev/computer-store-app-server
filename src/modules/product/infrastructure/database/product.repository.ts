import type {IProductRepository} from "../../domain/product.repository.contract.ts";
import {type ProductEntity, type ProductFullEntity, productInclude} from "../../domain/product.entity.ts";
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

    findFullById = async (id: number): Promise<ProductFullEntity | null> => {
        const product: ProductFullEntity | null = await this.dbService.product.findUnique({
            where: {
                id: id
            },
            include: productInclude
        });

        return product;
    }

    findMany = async (args: Prisma.ProductFindManyArgs): Promise<ProductEntity[]> => {
        const products: ProductEntity[] = await this.dbService.product.findMany(args);

        return products;
    }

    count = async (where: Prisma.ProductWhereInput): Promise<number> => {
        const count: number = await this.dbService.product.count({where});

        return count;
    }

    create = async (data: Prisma.ProductCreateInput): Promise<ProductFullEntity> => {
        const product: ProductFullEntity = await this.dbService.product.create({
            data: data,
            include: productInclude
        });

        return product;
    }

    update = async (id: number, data: Prisma.ProductUpdateInput): Promise<ProductFullEntity> => {
        const product: ProductFullEntity = await this.dbService.product.update({
            where: {
                id: id
            },
            data: data
        });

        return product;
    }


}