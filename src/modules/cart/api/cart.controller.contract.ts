import type {Request, Response} from "express";
import type {CartFullResponse} from "./cart.dto.ts";



export interface ICartController {
    findCartFullByUserId: (req: Request, res: Response<CartFullResponse>) => Promise<void>;
    createItem: (req: Request, res: Response<CartFullResponse>) => Promise<void>;
    updateItemQuantity: (req: Request, res: Response<CartFullResponse>) => Promise<void>;
    deleteItem: (req: Request, res: Response<CartFullResponse>) => Promise<void>;
    clearCart: (req: Request, res: Response) => Promise<void>;
}