import type {ProducerEntity} from "../domain/producer.entity.ts";
import {
    type ProducerResponse,
    producerResponseSchema, type ProducersResponse, producersResponseSchema
} from "./producer.dto.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";




export const toProducerResponse =
    (producer: ProducerEntity): ProducerResponse => {
        const transformedProducer = {
            ...producer
        }

        const validatedResponse: ProducerResponse = producerResponseSchema.parse(transformedProducer);

        return validatedResponse;
    }

export const toProducersResponse =
    (content: ProducerResponse[], meta: PaginationMeta): ProducersResponse => {
        const response: ProducersResponse = {
            content: content,
            meta: meta
        }

        const validatedResponse: ProducersResponse = producersResponseSchema.parse(response);

        return validatedResponse;
    }