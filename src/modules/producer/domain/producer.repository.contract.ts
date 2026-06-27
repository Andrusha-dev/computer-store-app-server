import type {ProducerEntity} from "./producer.entity.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";




export interface IProducerRepository {
    findById: (id: number) => Promise<ProducerEntity | null>;
    findMany: (args: Prisma.ProducerFindManyArgs) => Promise<ProducerEntity[]>;
    count: (where?: Prisma.ProducerWhereInput) => Promise<number>;
    create: (data: Prisma.ProducerCreateInput) => Promise<ProducerEntity>;
    update: (id: number, data: Prisma.ProducerUpdateInput) => Promise<ProducerEntity>;
    delete: (id: number) => Promise<ProducerEntity>;
}