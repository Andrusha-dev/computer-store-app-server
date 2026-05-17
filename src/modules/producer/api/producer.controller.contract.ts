import type {Request, Response} from "express";
import type {ProducerFullResponse, ProducerResponse, ProducersResponse} from "./producer.dto.ts";



export interface IProducerController {
    findById: (req: Request, res: Response<ProducerResponse>) => Promise<void>;
    findFullById: (req: Request, res: Response<ProducerFullResponse>) => Promise<void>;
    findMany: (req: Request, res: Response<ProducersResponse>) => Promise<void>;
    create: (req: Request, res: Response<ProducerFullResponse>) => Promise<void>;
    update: (req: Request, res: Response<ProducerFullResponse>) => Promise<void>;
    delete: (req: Request, res: Response<ProducerFullResponse>) => Promise<void>;
}