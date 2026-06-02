import type {
    CreateProducerDto,
    ProducerResponse,
    ProducersQuery,
    ProducersResponse, UpdateProducerDto
} from "../api/producer.dto.ts";


export interface IProducerService {
    findById: (id: number) => Promise<ProducerResponse>;
    findMany: (query: ProducersQuery) => Promise<ProducersResponse>;
    create: (dto: CreateProducerDto) => Promise<ProducerResponse>;
    update: (id: number, dto: UpdateProducerDto) => Promise<ProducerResponse>;
    delete: (id: number) => Promise<ProducerResponse>;
}