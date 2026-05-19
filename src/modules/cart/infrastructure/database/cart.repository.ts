import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import type {ICartRepository} from "../../domain/cart.repository.contract.ts";
import {type CartEntity, type CartFullEntity, cartInclude} from "../../domain/cart.entity.ts";
import {Prisma} from "@prisma/client";



interface Dependencies {
    dbService: PrismaService;
}

export class CartRepository implements ICartRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findById =
        async (id: number): Promise<CartEntity | null> => {
            const cart: CartEntity | null = await this.dbService.cart.findUnique({
                where: {
                    id: id,
                }
            });

            return cart;
        }

    findFullById =
        async (id: number): Promise<CartFullEntity | null> => {
            const cart: CartFullEntity | null = await this.dbService.cart.findUnique({
                where: {
                    id: id
                },
                include: cartInclude
            });

            return cart;
        }

    findMany =
        async (args: Prisma.CartFindManyArgs): Promise<CartEntity[]> => {
            const carts: CartEntity[] = await this.dbService.cart.findMany(args);

            return carts;
        }

    count =
        async (where?: Prisma.CartWhereInput): Promise<number> => {
            const count: number = await this.dbService.cart.count({where});

            return count;
        }

    create =
        async (data: Prisma.CartCreateInput): Promise<CartFullEntity> => {
            const cart: CartFullEntity = await this.dbService.cart.create({
                data: data,
                include: cartInclude,
            });

            return cart;
        }

    update =
        async (id: number, data: Prisma.CartUpdateInput): Promise<CartFullEntity> => {
            const cart: CartFullEntity = await this.dbService.cart.update({
                where: {
                    id: id,
                },
                data: data,
                include: cartInclude
            });

            return cart;
        }

    delete =
        async (id: number): Promise<CartFullEntity> => {
            const cart: CartFullEntity = await this.dbService.cart.delete({
                where: {
                    id: id,
                },
                include: cartInclude
            });

            return cart;
        }
}

