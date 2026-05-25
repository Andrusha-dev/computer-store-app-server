import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema.ts";
import {productResponseSchema} from "../../product/index.ts";




//ОСНОВНІ СХЕМИ (БУДІВЕЛЬНІ БЛОКИ)
//Схема для статусів замовлення
export const ORDER_STATUSES = ["PENDING", "PAID", "DELIVERING", "COMPLETED", "CANCELLED"] as const;
export const orderStatusSchema = z.enum(ORDER_STATUSES);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

//Основна схема для Order
export const orderSchema = z.object({
    id: z.number().int().positive(),
    status: orderStatusSchema,
    totalAmount: z.coerce.number().positive(),
    userId: z.coerce.number().int().positive()
});

//Основна схема OrderItem
export const orderItemSchema = z.object({
    id: z.number().int().positive(),
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().positive(),
    productId: z.coerce.number().int().positive(),
    orderId: z.coerce.number().int().positive()
});


//INPUT
export const createOrderDtoSchema = z.object({
    items: z.array(orderItemSchema.pick({productId: true, quantity: true}))
});
export type CreateOrderDto = z.infer<typeof createOrderDtoSchema>;

export const updateOrderDtoSchema = orderSchema.pick({status: true});
export type UpdateOrderDto = z.infer<typeof updateOrderDtoSchema>;

export const orderParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export type OrderParams = z.infer<typeof orderParamsSchema>;

export const orderFiltersSchema = z.object({
    //userId: z.coerce.number().int().positive().optional(),
    status: orderStatusSchema.optional()
});
export type OrderFilters = z.infer<typeof orderFiltersSchema>;
export const orderSortTypeSchema = orderSchema
    .pick({id: true, totalAmount: true})
    .keyof()
    .default("id");
export type OrderSortType = z.infer<typeof orderSortTypeSchema>;
export const ordersQuerySchema = paginationCriteriaSchema
    .extend({
        sortType: orderSortTypeSchema
    })
    .extend(orderFiltersSchema.shape);
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;


//OUTPUT
const orderItemResponseSchema = orderItemSchema.extend({
    product: productResponseSchema
});

export const orderFullResponseSchema = orderSchema.extend({
    items: z.array(orderItemResponseSchema)
});
export type OrderFullResponse = z.infer<typeof orderFullResponseSchema>;

export const ordersResponseSchema = z.object({
    content: z.array(orderFullResponseSchema),
    meta: paginationMetaSchema
});
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

