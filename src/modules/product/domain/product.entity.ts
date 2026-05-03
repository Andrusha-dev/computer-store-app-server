import {Prisma, Product} from "@prisma/client";


export type ProductEntity = Product;

export const productInclude = {
    producer: true,
} satisfies Prisma.ProductInclude //або as const;
export type ProductFullEntity = Prisma.ProductGetPayload<{ include: typeof productInclude}>



