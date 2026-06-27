import type {IProducerRepository} from "../../domain/producer.repository.contract";
import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service";
import {type ProducerEntity} from "../../domain/producer.entity";
import {Prisma} from "../../../../../prisma/generated/client";





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
        async (data: Prisma.ProducerCreateInput): Promise<ProducerEntity> => {
            const producer: ProducerEntity = await this.dbService.producer.create({
                data: data,
                //include не потрібен бо producer не потребує реляції products
            });

            return producer;
        }

    update =
        async (id: number, data: Prisma.ProducerUpdateInput): Promise<ProducerEntity> => {
            const producer: ProducerEntity = await this.dbService.producer.update({
                where: {
                    id: id
                },
                data: data,
                //include не потрібен бо producer не потребує реляції products
            });

            return producer;
        }

    delete =
        async (id: number): Promise<ProducerEntity> => {
            const producer: ProducerEntity = await this.dbService.producer.delete({
                where: {
                    id: id
                },
                //include не потрібен бо producer не потребує реляції products
            });

            return producer;
        }
}