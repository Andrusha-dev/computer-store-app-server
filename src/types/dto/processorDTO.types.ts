import {
    type NumberOfCores, numberOfCoresSchema, type NumberOfThreads, numberOfThreadsSchema,
    type Processor,
    type ProcessorProducer, processorProducerSchema, processorSchema,
    type ProcessorSocket, processorSocketSchema
} from "../models/pcComponents/processor.types.ts";
import {
    type PaginationResponseDTO,
    paginationResponseDTOSchema
} from "./paginationDTO.types.ts";
import {z} from "zod";


export interface FetchProcessorsResponseDTO extends PaginationResponseDTO {
    content: Processor[];
    minPrice: number;
    maxPrice: number;
    producers: ProcessorProducer[]; // Перейменовано з producer, щоб уникнути конфлікту
    processorSockets: ProcessorSocket[]; // Перейменовано з processorSocket
    numberOfCores: NumberOfCores[]; // Перейменовано з numberOfCores
    numberOfThreads: NumberOfThreads[]; // Перейменовано з numberOfThreads
}
export const fetchProcessorsResponseDTOSchema = paginationResponseDTOSchema.extend({
    content: z.array(processorSchema),
    minPrice: z.number(),
    maxPrice: z.number(),
    producers: z.array(processorProducerSchema),
    processorSockets: z.array(processorSocketSchema),
    numberOfCores: z.array(numberOfCoresSchema),
    numberOfThreads: z.array(numberOfThreadsSchema),
});