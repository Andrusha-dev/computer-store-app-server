import type {IProducerService} from "./producer.service.contract.ts";
import type {
    CreateProducerDto,
    ProducerFullResponse,
    ProducerResponse,
    ProducersQuery,
    ProducersResponse, UpdateProducerDto
} from "../api/producer.dto.ts";
import type {ProducerEntity, ProducerFullEntity} from "../domain/producer.entity.ts";
import type {IProducerRepository} from "../domain/producer.repository.contract.ts";
import {NotFoundError} from "../../../shared/error/custom.errors.ts";
import {toProducerFullResponse, toProducerResponse, toProducersResponse} from "../api/producer.mapper.ts";
import {Prisma} from "@prisma/client";
import {
    toProducerCreateInput,
    toProducerFindManyArgs,
    toProducerUpdateInput,
} from "./producer.mapper.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";
import {createPaginationMeta} from "../../../shared/utils/pagination.utils.ts";



interface Dependencies {
    producerRepository: IProducerRepository
}

export class ProducerService implements IProducerService {
    private readonly producerRepository: IProducerRepository;

    constructor({producerRepository}: Dependencies) {
        this.producerRepository = producerRepository;
    }

    findById =
        async (id: number): Promise<ProducerResponse> => {
            const producer: ProducerEntity | null = await this.producerRepository.findById(id);

            if(!producer) {
                throw new NotFoundError(`Виробника з ID ${id} не знайдено`);
            }

            const response: ProducerResponse = toProducerResponse(producer);

            return response;
        }

    findFullById =
        async (id: number): Promise<ProducerFullResponse> => {
            const producer: ProducerFullEntity | null = await this.producerRepository.findFullById(id);

            if(!producer) {
                throw new NotFoundError(`Виробника з ID ${id} не знайдено`)
            }

            const response: ProducerFullResponse = toProducerFullResponse(producer);

            return response;
        }

    findMany =
        async (query: ProducersQuery): Promise<ProducersResponse> => {
            const args: Prisma.ProducerFindManyArgs = toProducerFindManyArgs(query);

            const [producers, totalElements] = await Promise.all([
                this.producerRepository.findMany(args),
                this.producerRepository.count(args.where),
            ]);

            const content: ProducerResponse[] = producers.map(toProducerResponse);
            const meta: PaginationMeta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);

            const producersResponse: ProducersResponse = toProducersResponse(content, meta);

            return producersResponse;
        }

    create =
        async (dto: CreateProducerDto): Promise<ProducerFullResponse> => {
            const data: Prisma.ProducerCreateInput = toProducerCreateInput(dto);

            const producer: ProducerFullEntity = await this.producerRepository.create(data);

            const response: ProducerFullResponse = toProducerFullResponse(producer);

            return response;
        }

    update =
        async (id: number, dto: UpdateProducerDto): Promise<ProducerFullResponse> => {
            const data: Prisma.ProducerUpdateInput = toProducerUpdateInput(dto);

            const producer: ProducerFullEntity = await this.producerRepository.update(id, data);

            const response: ProducerFullResponse = toProducerFullResponse(producer);

            return response;
        }

    delete =
        async (id: number): Promise<ProducerFullResponse> => {
            const producer: ProducerFullEntity = await this.producerRepository.delete(id);

            const response: ProducerFullResponse = toProducerFullResponse(producer);

            return response;
        }
}