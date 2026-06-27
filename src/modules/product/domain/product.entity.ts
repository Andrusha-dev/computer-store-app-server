import {Prisma, type Product} from "../../../../prisma/generated/client";




export type ProductEntity = Product;

export const productInclude = {
    producer: true,
    //Реляції cartItems та oderItems не потрібні, бо вони лише перевантажувати бд
} satisfies Prisma.ProductInclude //або as const;
export type ProductFullEntity = Prisma.ProductGetPayload<{ include: typeof productInclude}>



