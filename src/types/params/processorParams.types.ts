//Тип для параметрів запиту в методі fetchProcessors
import type {ProcessorFilters} from "../entity/pcComponents/processor.types.ts";
import type {PageParams} from "./pageParams.types.ts";

export interface FetchProcessorsParams extends ProcessorFilters, PageParams {}