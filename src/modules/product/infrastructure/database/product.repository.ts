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

    count = async (where?: Prisma.ProductWhereInput): Promise<number> => {
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
            data: data,
            include: productInclude
        });

        return product;
    }

    delete = async (id: number): Promise<ProductFullEntity> => {
        const product: ProductFullEntity = await this.dbService.product.delete({
            where: {
                id: id
            },
            include: productInclude
        });

        return product;
    }

    //Метод, для зменшення кількості товару, якщо кількість товару на складі це дозволяє
    decreaseQuantityWithCheck =
        async (id: number, count: number): Promise<boolean> => {
            //Використовуємо саме updateMany, бо звичайний update шукає лише по унікальних полях, а quantity не є унікальним
            const updateResult = await this.dbService.product.updateMany({
                where: {
                    id: id,
                    quantity: {gte: count}
                },
                data: {
                    quantity: {decrement: count}
                }
            });

            const isUpdated: boolean = updateResult.count > 0;

            return isUpdated;
        }

    //Метод для збільшення кількості товару, у випадку, якщо під час оформлення замовлення сталася помилка
    increaseQuantity =
        async (id: number, count: number): Promise<ProductFullEntity> => {
            const product: ProductFullEntity = await this.dbService.product.update({
                where: {
                    id: id
                },
                data: {
                    quantity: {increment: count}
                },
                include: productInclude
            });

            return product;
        }
}