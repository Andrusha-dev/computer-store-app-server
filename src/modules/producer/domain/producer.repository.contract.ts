import type {ProducerEntity, ProducerFullEntity} from "./producer.entity.ts";
import {Prisma} from "@prisma/client";


export interface IProducerRepository {
    findById: (id: number) => Promise<ProducerEntity | null>;
    findFullById: (id: number) => Promise<ProducerFullEntity | null>;
    findMany: (args: Prisma.ProducerFindManyArgs) => Promise<ProducerEntity[]>;
    count: (where?: Prisma.ProducerWhereInput) => Promise<number>;
    create: (data: Prisma.ProducerCreateInput) => Promise<ProducerFullEntity>;
    update: (id: number, data: Prisma.ProducerUpdateInput) => Promise<ProducerFullEntity>;
    delete: (id: number) => Promise<ProducerFullEntity>;
}