import type {Request, Response} from "express";
import type {
    ProducerResponse,
    ProducersResponse
} from "./producer.dto.ts";



export interface IProducerController {
    findById: (req: Request, res: Response<ProducerResponse>) => Promise<void>;
    findMany: (req: Request, res: Response<ProducersResponse>) => Promise<void>;
    create: (req: Request, res: Response<ProducerResponse>) => Promise<void>;
    update: (req: Request, res: Response<ProducerResponse>) => Promise<void>;
    delete: (req: Request, res: Response<ProducerResponse>) => Promise<void>;
}