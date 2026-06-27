import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import type {ICartRepository} from "../../domain/cart.repository.contract.ts";
import {type CartFullEntity, cartInclude} from "../../domain/cart.entity.ts";
import {Prisma} from "../../../../../prisma/generated/client.ts";





interface Dependencies {
    dbService: PrismaService;
}

export class CartRepository implements ICartRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findCartFullByUserId =
        async (userId: number): Promise<CartFullEntity | null> => {
            const cart: CartFullEntity | null = await this.dbService.cart.findUnique({
                where: {
                    id: userId
                },
                include: cartInclude
            });

            return cart;
        }

    createItem =
        async (userId: number, productId: number, quantity: number): Promise<CartFullEntity> => {
            const cart: CartFullEntity = await this.dbService.cart.update({
                where: {id: userId},
                data: {
                    items: {
                        upsert: {
                            //Для перевірки унікальності CartItem нам потрібен саме обєкт cartId_productId, який генерує prisma, відповідно до схеми
                            where: {cartId_productId: {cartId: userId, productId: productId}},
                            update: {quantity: {increment: quantity}},
                            create: {quantity: quantity, productId: productId} // cartId Prisma підставить сама
                        }
                    }
                },
                include: cartInclude
            });

            return cart
        }

    updateItemQuantity =
        async (userId: number, productId: number, quantity: number): Promise<CartFullEntity> => {
            const cart: CartFullEntity = await this.dbService.cart.update({
                where: {id: userId},
                data: {
                    items: {
                        update: {
                            //Для апдейта нам достатньо cartId_productId, тому знати id CartItem не потрібно
                            where: {cartId_productId: {cartId: userId, productId: productId}},
                            data: {quantity: quantity}
                        }
                    }
                },
                include: cartInclude,
            });

            return cart;
        }

    deleteItem =
        async (userId: number, productId: number): Promise<CartFullEntity> => {
            const cart: CartFullEntity = await this.dbService.cart.update({
                where: {id: userId},
                data: {
                    items: {
                        delete: {
                            //поле delete потребує безпосередньо унікального ідентифікатора, тому cartId_productId вказуємо напряму, без where
                            cartId_productId: {cartId: userId, productId: productId}
                        }
                    }
                },
                include: cartInclude,
            });

            return cart;
        }

    clearCart =
        async (userId: number, tx?: Prisma.TransactionClient): Promise<void> => {
            const client = tx ?? this.dbService;

            await client.cart.update({
                where: {id: userId},
                data: {
                    items: {
                        deleteMany: {}
                    }
                }
                //include не потрібен, бо результат, що повертається нас не цікавить
            });
        }
}

