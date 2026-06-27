import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema";
import {productResponseSchema} from "../../product/index";
import {createPaymentDtoSchema, paymentResponseSchema} from "../../payment/api/payment.dto";
import {createDeliveryDtoSchema, deliveryResponseSchema} from "../../delivery/api/delivery.dto";




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
//При створенні замовлення dto міститиме дані про оплату та доставку, але вони будуть створені пізніше
export const createOrderDtoSchema = z.object({
    payment: createPaymentDtoSchema,
    delivery: createDeliveryDtoSchema
});
export type CreateOrderDto = z.infer<typeof createOrderDtoSchema>;

export const orderParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});
export type OrderParams = z.infer<typeof orderParamsSchema>;

export const orderFiltersSchema = z.object({
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

//Тип для оновлення поля trackingNumber в таблиці Delivery
export const setTrackingNumberDtoSchema = z.object({
    trackingNumber: z.string().min(1, "Номер ТТН не може бути порожнім")
});
export type SetTrackingNumberDto = z.infer<typeof setTrackingNumberDtoSchema>;


//OUTPUT
const orderItemFullResponseSchema = orderItemSchema.extend({
    product: productResponseSchema
});

export const orderFullResponseSchema = orderSchema.extend({
    items: z.array(orderItemFullResponseSchema),
    payment: paymentResponseSchema,
    delivery: deliveryResponseSchema,
});
export type OrderFullResponse = z.infer<typeof orderFullResponseSchema>;


// Окремий тип для чекауту, який додатково повертає посилання на оплату банку
export const checkoutResponseSchema = z.object({
    order: orderFullResponseSchema,
    paymentUrl: z.url().nullable()
});
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;

//Тип для url оплати після повторної генерації інвойсу
export const retryPaymentResponseSchema = z.object({
    paymentUrl: z.url()
});
export type RetryPaymentResponse = z.infer<typeof retryPaymentResponseSchema>;

export const ordersResponseSchema = z.object({
    content: z.array(orderFullResponseSchema),
    meta: paginationMetaSchema
});
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

