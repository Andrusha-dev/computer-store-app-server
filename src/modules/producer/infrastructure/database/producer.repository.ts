import type {IProducerRepository} from "../../domain/producer.repository.contract.ts";
import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import {type ProducerEntity, type ProducerFullEntity, producerInclude} from "../../domain/producer.entity.ts";
import type {ProductFullEntity} from "../../../product/domain/product.entity.ts";


interface Dependencies {
    dbService: PrismaService
}

export class ProducerRepository implements IProducerRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findById = async (id: number): Promise<ProducerEntity | null> => {
        const producer: ProducerEntity | null = await this.dbService.producer.findUnique({
            where: {
                id: id
            }
        });

        return producer;
    }

    findFullById = async (id: number): Promise<ProducerFullEntity | null> => {
        const producer: ProducerFullEntity | null = await this.dbService.producer.findUnique({
            where: {
                id: id
            },
            include: producerInclude
        });

        return producer;
    }
}