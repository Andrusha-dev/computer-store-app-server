import type {Request, Response} from "express";
import type {IProducerService} from "../application/producer.service.contract.ts";
import type {
    CreateProducerDto,
    ProducerParams,
    ProducerResponse,
    ProducersQuery,
    ProducersResponse, UpdateProducerDto
} from "./producer.dto.ts";
import {
    extractValidatedBodyOrThrow,
    extractValidatedParamsOrThrow,
    extractValidatedQueryOrThrow
} from "../../../api/helpers/http.helpers.ts";




interface Dependencies {
    producerService: IProducerService;
}

export class ProducerController {
    private readonly producerService: IProducerService;

    constructor({producerService}: Dependencies) {
        this.producerService = producerService;
    }

    findById =
        async (req: Request, res: Response<ProducerResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<ProducerParams>(req);

            const response: ProducerResponse = await this.producerService.findById(id);

            res.json(response);
        }

    findMany =
        async (req: Request, res: Response<ProducersResponse>): Promise<void> => {
            const query: ProducersQuery = extractValidatedQueryOrThrow<ProducersQuery>(req);

            const response: ProducersResponse = await this.producerService.findMany(query);

            res.json(response);
        }

    create =
        async (req: Request, res: Response<ProducerResponse>): Promise<void> => {
            const dto: CreateProducerDto = extractValidatedBodyOrThrow<CreateProducerDto>(req);

            const response: ProducerResponse = await this.producerService.create(dto);

            res.json(response);
        }

    update =
        async (req: Request, res: Response<ProducerResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<ProducerParams>(req);
            const dto: UpdateProducerDto = extractValidatedBodyOrThrow<UpdateProducerDto>(req);

            const response: ProducerResponse = await this.producerService.update(id, dto);

            res.json(response);
        }

    delete =
        async (req: Request, res: Response<ProducerResponse>): Promise<void> => {
            const {id} = extractValidatedParamsOrThrow<ProducerParams>(req);

            const response: ProducerResponse = await this.producerService.delete(id);

            res.json(response);
        }
}