import {Prisma, type Producer} from "@prisma/client";


export type ProducerEntity = Producer;

export const producerInclude = {
    products: true,
} satisfies Prisma.ProducerInclude;
export type ProducerFullEntity = Prisma.ProducerGetPayload<{include: typeof producerInclude}>;