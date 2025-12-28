import {type FetchProcessorsParams} from "../types/params/processorParams.types.ts";
import {type Processor} from "../types/models/pcComponents/processor.types.ts";
import {processors} from "../data/pcComponents/processors.ts";
import {type PageParams} from "../types/params/pageParams.types.ts";
import {type FetchProcessorsResponseDTO} from "../types/dto/processorDTO.types.ts";

export const fetchProcessors = (fetchProcessorsParams: FetchProcessorsParams): Processor[] => {
    let filteredProcessors: Processor[] = [...processors];

    if(fetchProcessorsParams.minPrice !== undefined) {
        let filteredByMinPriceProcessors: Processor[] = [];

        const minPrice: number = fetchProcessorsParams.minPrice;
        filteredByMinPriceProcessors = filteredProcessors.filter((processor) => minPrice <= processor.price);

        filteredProcessors = filteredByMinPriceProcessors;
    }

    if (fetchProcessorsParams.maxPrice !== undefined) {
        let filteredByMaxPriceProcessors: Processor[] = [];

        const maxPrice: number = fetchProcessorsParams.maxPrice;
        filteredByMaxPriceProcessors = filteredProcessors.filter((processor) => maxPrice >= processor.price);

        filteredProcessors = filteredByMaxPriceProcessors;
    }

    if (fetchProcessorsParams.producer !== undefined) {
        let filteredByProducerProcessors: Processor[] = [];

        if (fetchProcessorsParams.producer.includes("AMD")) {
            filteredByProducerProcessors = filteredProcessors.filter((processor) => processor.processorOptions.producer === "AMD");
        }

        if (fetchProcessorsParams.producer.includes("Intel")) {
            filteredByProducerProcessors = [
                ...filteredByProducerProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.producer === "Intel")
            ]
        }

        filteredProcessors = filteredByProducerProcessors;
    }

    if (fetchProcessorsParams.processorSocket !== undefined) {
        let filteredBySocketProcessors: Processor[] = [];

        if (fetchProcessorsParams.processorSocket.includes("AM2")) {
            filteredBySocketProcessors = filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM2");
        }

        if (fetchProcessorsParams.processorSocket.includes("AM3")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM3")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("AM4")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM4")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("AM5")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "AM5")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("LGA1150")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1150")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("LGA1151")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1151")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("LGA1155")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1155")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("LGA1200")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1200")
            ]
        }

        if (fetchProcessorsParams.processorSocket.includes("LGA1700")) {
            filteredBySocketProcessors = [
                ...filteredBySocketProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.processorSocket === "LGA1700")
            ]
        }

        filteredProcessors = filteredBySocketProcessors;
    }

    if (fetchProcessorsParams.numberOfCores !== undefined) {
        let filteredByNumberOfCoresProcessors: Processor[] = [];

        if (fetchProcessorsParams.numberOfCores.includes("2cores")) {
            filteredByNumberOfCoresProcessors = filteredProcessors.filter((processor) =>
                processor.processorOptions.numberOfCores === "2cores");
        }

        if (fetchProcessorsParams.numberOfCores.includes("4cores")) {
            filteredByNumberOfCoresProcessors = [
                ...filteredByNumberOfCoresProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfCores === "4cores")
            ];
        }

        if (fetchProcessorsParams.numberOfCores.includes("6cores")) {
            filteredByNumberOfCoresProcessors = [
                ...filteredByNumberOfCoresProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfCores === "6cores")
            ];
        }

        if (fetchProcessorsParams.numberOfCores.includes("8cores")) {
            filteredByNumberOfCoresProcessors = [
                ...filteredByNumberOfCoresProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfCores === "8cores")
            ];
        }

        filteredProcessors = filteredByNumberOfCoresProcessors;
    }

    if (fetchProcessorsParams.numberOfThreads !== undefined) {
        let filteredByNumberOfThreadsProcessors: Processor[] = [];

        if (fetchProcessorsParams.numberOfThreads.includes("2threads")) {
            filteredByNumberOfThreadsProcessors = filteredProcessors.filter((processor) =>
                processor.processorOptions.numberOfThreads === "2threads");
        }

        if (fetchProcessorsParams.numberOfThreads.includes("4threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "4threads")
            ];
        }

        if (fetchProcessorsParams.numberOfThreads.includes("6threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "6threads")
            ];
        }

        if (fetchProcessorsParams.numberOfThreads.includes("8threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "8threads")
            ];
        }

        if (fetchProcessorsParams.numberOfThreads.includes("12threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "12threads")
            ];
        }

        if (fetchProcessorsParams.numberOfThreads.includes("16threads")) {
            filteredByNumberOfThreadsProcessors = [
                ...filteredByNumberOfThreadsProcessors,
                ...filteredProcessors.filter((processor) => processor.processorOptions.numberOfThreads === "16threads")
            ];
        }

        filteredProcessors = filteredByNumberOfThreadsProcessors;
    }

    return filteredProcessors;
}

export const paginateProcessors = (
    processors: Processor[],
    pageParams: PageParams,
): Processor[] => {

    let paginatedProcessors: Processor[] = [...processors];

    if(paginatedProcessors.length === 0) {
        return paginatedProcessors;
    }

    if(pageParams.sortType !== undefined && pageParams.sortOrder !== undefined) {
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
    }

    if(pageParams.pageNo !== undefined && pageParams.pageSize !== undefined) {
        const startIndex: number = (((pageParams.pageNo + 1) * pageParams.pageSize) - pageParams.pageSize);

        console.log(`start index for page ${pageParams.pageNo}: `, startIndex);

        paginatedProcessors = paginatedProcessors.splice(startIndex, pageParams.pageSize);


        return paginatedProcessors
    }

    return paginatedProcessors;
}