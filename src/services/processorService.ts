import {
    type FetchProcessorsParams, type ParsedProcessorsParams,
    type ProcessorFilters
} from "../types/params/processorParams.types.ts";
import {
    type NumberOfCores, type NumberOfThreads,
    type Processor,
    type ProcessorProducer,
    type ProcessorSocket
} from "../types/models/pcComponents/processor.types.ts";
import {processors} from "../data/pcComponents/processors.ts";
import {type PageParams} from "../types/params/pageParams.types.ts";
import {
    type GetProcessorsCatalogResponse,
    getProcessorsCatalogResponseSchema
} from "../types/dto/processorDTO.types.ts";


//метод для обєлнання параметрів запиту FetchProcessorsParams по групах processorFilters: ProcessorFilters та pageParams: PageParams
const parseProcessorsParams = (fetchProcessorsParams: FetchProcessorsParams): ParsedProcessorsParams => {
    const {
        pageNo = 0,
        pageSize = 10,
        sortType = "price",
        sortOrder = "asc",
        ...processorFilters
    } = fetchProcessorsParams;

    const pageParams: PageParams = {
        pageNo,
        pageSize,
        sortType,
        sortOrder
    }

    const parsedProcessorsParams: ParsedProcessorsParams = {
        processorFilters,
        pageParams
    }

    return parsedProcessorsParams;
}

//метод для фільтрації списку процессорів
export const fetchProcessors = (processorFilters: ProcessorFilters): Processor[] => {
    let filteredProcessors: Processor[] = [...processors];

    if(processorFilters.minPrice !== undefined) {
        let filteredByMinPriceProcessors: Processor[] = [];

        const minPrice: number = processorFilters.minPrice;
        filteredByMinPriceProcessors = filteredProcessors.filter((processor) => minPrice <= processor.price);

        filteredProcessors = filteredByMinPriceProcessors;
    }

    if (processorFilters.maxPrice !== undefined) {
        let filteredByMaxPriceProcessors: Processor[] = [];

        const maxPrice: number = processorFilters.maxPrice;
        filteredByMaxPriceProcessors = filteredProcessors.filter((processor) => maxPrice >= processor.price);

        filteredProcessors = filteredByMaxPriceProcessors;
    }

    if (processorFilters.producer !== undefined) {
        let filteredByProducerProcessors: Processor[] = [];

        if (processorFilters.producer.includes("AMD")) {
            filteredByProducerProcessors = filteredProcessors.filter((processor) => processor.processorOptions.producer === "AMD");
        }

        if (processorFilters.producer.includes("Intel")) {
            filteredByProducerProcessors = [
                ...filteredByProducerProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.producer === "Intel")
            ]
        }

        filteredProcessors = filteredByProducerProcessors;
    }

    if (processorFilters.processorSocket !== undefined) {
        let filteredBySocketProcessors: Processor[] = [];

        if (processorFilters.processorSocket.includes("AM2")) {
            filteredBySocketProcessors = filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM2");
        }

        if (processorFilters.processorSocket.includes("AM3")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM3")
            ]
        }

        if (processorFilters.processorSocket.includes("AM4")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM4")
            ]
        }

        if (processorFilters.processorSocket.includes("AM5")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM5")
            ]
        }

        if (processorFilters.processorSocket.includes("LGA1150")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1150")
            ]
        }

        if (processorFilters.processorSocket.includes("LGA1151")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1151")
            ]
        }

        if (processorFilters.processorSocket.includes("LGA1155")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1155")
            ]
        }

        if (processorFilters.processorSocket.includes("LGA1200")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1200")
            ]
        }

        if (processorFilters.processorSocket.includes("LGA1700")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1700")
            ]
        }

        filteredProcessors = filteredBySocketProcessors;
    }

    if (processorFilters.numberOfCores !== undefined) {
        let filteredByNumberOfCoresProcessors: Processor[] = [];

        if (processorFilters.numberOfCores.includes("2cores")) {
            filteredByNumberOfCoresProcessors = filteredProcessors.filter((processor) =>
                processor.processorOptions.numberOfCores === "2cores");
        }

        if (processorFilters.numberOfCores.includes("4cores")) {
            filteredByNumberOfCoresProcessors = [
                ...filteredByNumberOfCoresProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfCores === "4cores")
            ];
        }

        if (processorFilters.numberOfCores.includes("6cores")) {
            filteredByNumberOfCoresProcessors = [
                ...filteredByNumberOfCoresProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfCores === "6cores")
            ];
        }

        if (processorFilters.numberOfCores.includes("8cores")) {
            filteredByNumberOfCoresProcessors = [
                ...filteredByNumberOfCoresProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfCores === "8cores")
            ];
        }

        filteredProcessors = filteredByNumberOfCoresProcessors;
    }

    if (processorFilters.numberOfThreads !== undefined) {
        let filteredByNumberOfThreadsProcessors: Processor[] = [];

        if (processorFilters.numberOfThreads.includes("2threads")) {
            filteredByNumberOfThreadsProcessors = filteredProcessors.filter((processor) =>
                processor.processorOptions.numberOfThreads === "2threads");
        }

        if (processorFilters.numberOfThreads.includes("4threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "4threads")
            ];
        }

        if (processorFilters.numberOfThreads.includes("6threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "6threads")
            ];
        }

        if (processorFilters.numberOfThreads.includes("8threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "8threads")
            ];
        }

        if (processorFilters.numberOfThreads.includes("12threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "12threads")
            ];
        }

        if (processorFilters.numberOfThreads.includes("16threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "16threads")
            ];
        }

        filteredProcessors = filteredByNumberOfThreadsProcessors;
    }

    return filteredProcessors;
}

//метод для пагінації списку процесорів після їх попередньої фільтрації методом fetchProcessors
export const paginateProcessors = (
    processors: Processor[],
    pageParams: PageParams,
): Processor[] => {

    let paginatedProcessors: Processor[] = [...processors];

    if(paginatedProcessors.length === 0) {
        return paginatedProcessors;
    }


    if(pageParams.sortType === "price" && pageParams.sortOrder === "asc") {
        paginatedProcessors = paginatedProcessors.sort((a, b) => a.price - b.price);
    }
    if(pageParams.sortType === "price" && pageParams.sortOrder === "desc") {
        paginatedProcessors = paginatedProcessors.sort((a, b) => b.price - a.price);
    }
    if(pageParams.sortType === "quantity" && pageParams.sortOrder === "asc") {
        paginatedProcessors = paginatedProcessors.sort((a, b) => a.quantity - b.quantity);
    }
    if(pageParams.sortType === "quantity" && pageParams.sortOrder === "desc") {
        paginatedProcessors = paginatedProcessors.sort((a, b) => b.quantity - a.quantity);
    }


    const startIndex: number = (((pageParams.pageNo + 1) * pageParams.pageSize) - pageParams.pageSize);
    console.log(`start index for page ${pageParams.pageNo}: `, startIndex);
    paginatedProcessors = paginatedProcessors.splice(startIndex, pageParams.pageSize);


    return paginatedProcessors;
}


//метод, що повертає FetchProcessorsResponse (список відфільтрованих та пагінованих процесорів та додаткові метадані)
export const getProcessorsCatalog = (fetchProcessorsParams: FetchProcessorsParams): GetProcessorsCatalogResponse => {
    // Використовуємо метод для парсингу
    const { processorFilters, pageParams } = parseProcessorsParams(fetchProcessorsParams);

    // Отримуємо відфільтровані дані (для агрегацій)
    const filteredProcessors: Processor[] = fetchProcessors(processorFilters);

    // Отримуємо пагіновані дані для поточної сторінки
    const paginatedProcessors: Processor[] = paginateProcessors(filteredProcessors, pageParams);


    //Отримуємо максимальну ціну відфільтрованих обєктів в списку filteredProcessors
    const maxPrice: number = filteredProcessors.reduce((acc, p) => Math.max(acc, p.price), 0);

    //Отримуємо мінімальну ціну відфільтрованих обєктів в списку filteredProcessors
    const minPrice: number = filteredProcessors.reduce((acc, p) => Math.min(acc, p.price), maxPrice);

    //Отримуємо список унікальних обєктів ProcessorProducer[] серед обєктів в списку filteredProcessors
    const uniqueProducers: ProcessorProducer[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.producer)));

    //Отримуємо список унікальних обєктів ProcessorSocket[] серед обєктів в списку filteredProcessors
    const uniqueProcessorSockets: ProcessorSocket[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.processorSocket)));

    //Отримуємо список унікальних обєктів NumberOfCores[] серед обєктів в списку filteredProcessors
    const uniqueNumberOfCores: NumberOfCores[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.numberOfCores)));

    //Отримуємо список унікальних обєктів NumberOfThreads[] серед обєктів в списку filteredProcessors
    const uniqueNumberOfThreads: NumberOfThreads[] = Array.from(new Set(filteredProcessors.map((p: Processor) =>
        p.processorOptions.numberOfThreads)));

    const pageNo: number = pageParams.pageNo;
    const pageSize: number = pageParams.pageSize;
    const totalElements: number = filteredProcessors.length;
    const totalPages: number = Math.ceil(totalElements / pageSize);
    const last: boolean = (pageParams.pageNo) === (totalPages - 1);

    // Формуємо DTO
    const getProcessorsCatalogResponse: GetProcessorsCatalogResponse = {
        content: paginatedProcessors,
        minPrice: minPrice,
        maxPrice: maxPrice,
        producers: uniqueProducers,
        processorSockets: uniqueProcessorSockets,
        numberOfCores: uniqueNumberOfCores,
        numberOfThreads: uniqueNumberOfThreads,
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: totalPages,
        totalElements: totalElements,
        last: last
    };

    //валідуєм дані
    const validatedGetProcessorsCatalogResponse: GetProcessorsCatalogResponse = getProcessorsCatalogResponseSchema.parse(getProcessorsCatalogResponse);
    return validatedGetProcessorsCatalogResponse;
};