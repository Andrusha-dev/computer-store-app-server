import {
    type NumberOfCores, type NumberOfThreads,
    type Processor,
    type ProcessorProducer,
    type ProcessorSocket
} from "../models/pcComponents/processor.types.ts";
import {type PaginationResponseDTO} from "./paginationDTO.types.ts";


export interface FetchProcessorsResponseDTO extends PaginationResponseDTO {
    content: Processor[];
    minPrice: number;
    maxPrice: number;
    producers: ProcessorProducer[]; // Перейменовано з producer, щоб уникнути конфлікту
    processorSockets: ProcessorSocket[]; // Перейменовано з processorSocket
    numberOfCores: NumberOfCores[]; // Перейменовано з numberOfCores
    numberOfThreads: NumberOfThreads[]; // Перейменовано з numberOfThreads
}