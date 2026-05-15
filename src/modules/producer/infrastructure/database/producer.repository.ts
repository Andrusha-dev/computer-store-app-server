import type {IProducerRepository} from "../../domain/producer.repository.contract.ts";
import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import {type ProducerEntity, type ProducerFullEntity, producerInclude} from "../../domain/producer.entity.ts";
import {Prisma} from "@prisma/client";


interface Dependencies {
    dbService: PrismaService
}

export class ProducerRepository implements IProducerRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findById =
        async (id: number): Promise<ProducerEntity | null> => {
            const producer: ProducerEntity | null = await this.dbService.producer.findUnique({
                where: {
                    id: id
                }
            });

            return producer;
        }

    findFullById =
        async (id: number): Promise<ProducerFullEntity | null> => {
            const producer: ProducerFullEntity | null = await this.dbService.producer.findUnique({
                where: {
                    id: id
                },
                include: producerInclude
            });

            return producer;
        }

    findMany =
        async (args: Prisma.ProducerFindManyArgs): Promise<ProducerEntity[]> => {
            const producers: ProducerEntity[] = await this.dbService.producer.findMany(args);

            return producers;
        }

    count =
        async (where?: Prisma.ProducerWhereInput): Promise<number> => {
            const count: number = await this.dbService.producer.count({where});

            return count;
        }

    create =
        async (data: Prisma.ProducerCreateInput): Promise<ProducerFullEntity> => {
            const producer: ProducerFullEntity = await this.dbService.producer.create({
                data: data,
                include: producerInclude
            });

            return producer;
        }

    update =
        async (id: number, data: Prisma.ProducerUpdateInput): Promise<ProducerFullEntity> => {
            const producer: ProducerFullEntity = await this.dbService.producer.update({
                where: {
                    id: id
                },
                data: data,
                include: producerInclude
            });

            return producer;
        }

    delete =
        async (id: number): Promise<ProducerFullEntity> => {
            const producer: ProducerFullEntity = await this.dbService.producer.delete({
                where: {
                    id: id
                },
                include: producerInclude
            });

            return producer;
        }
}