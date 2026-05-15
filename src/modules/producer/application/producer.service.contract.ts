import type {
    CreateProducerDto,
    ProducerFullResponse,
    ProducerResponse,
    ProducersQuery,
    ProducersResponse, UpdateProducerDto
} from "../api/producer.dto.ts";


export interface IProducerService {
    findById: (id: number) => Promise<ProducerResponse>;
    findFullById: (id: number) => Promise<ProducerFullResponse>;
    findMany: (query: ProducersQuery) => Promise<ProducersResponse>;
    create: (dto: CreateProducerDto) => Promise<ProducerFullResponse>;
    update: (id: number, dto: UpdateProducerDto) => Promise<ProducerFullResponse>;
    delete: (id: number) => Promise<ProducerFullResponse>;
}