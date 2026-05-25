import {Prisma} from "@prisma/client";


export const toOrderWhereInput =
    (userId: number): Prisma.OrderWhereInput => {
        const where: Prisma.OrderWhereInput = {
            userId: userId,
        }

        return where;
    }