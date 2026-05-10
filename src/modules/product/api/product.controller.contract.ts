import type {ProductFullResponse, ProductResponse, ProductsResponse} from "./product.dto.ts";
import type {Request, Response} from "express";

export interface IProductController {
    findById: (req: Request, res: Response<ProductResponse>) => Promise<void>;
    findFullById: (req: Request, res: Response<ProductFullResponse>) => Promise<void>;
    findMany: (req: Request, res: Response<ProductsResponse>) => Promise<void>;
    create: (req: Request, res: Response<ProductFullResponse>) => Promise<void>;
    update: (req: Request, res: Response<ProductFullResponse>) => Promise<void>;
    delete: (req: Request, res: Response<ProductFullResponse>) => Promise<void>;
}