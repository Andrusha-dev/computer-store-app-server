import {z} from "zod";


//БАЗОВІ СХЕМИ (БУДІВЕЛЬНІ БЛОКИ)
//Тип для методів доставки
export const DELIVERY_METHODS = ["NOVA_POSHTA", "UKRPOSHTA", "COURIER"] as const;
export const deliveryMethodSchema = z.enum(DELIVERY_METHODS);
export type DeliveryMethod = z.infer<typeof deliveryMethodSchema>;

//Базовий тип доставки
const baseDeliverySchema = z.object({
    id: z.number().int().positive(),
    method: deliveryMethodSchema,
    price: z.coerce.number().nonnegative().default(0),
    trackingNumber: z.string().nullable(),
    details: z.any(), //Це поле має тип json в бд, тому його потрібно буде розширити через discriminatedUnion

    orderId: z.number().int().positive()
})

//Базова схема поля details
const baseDeliveryDetailsSchema = z.object({
    city: z.string().min(2, {error: "Назва міста має бути не менше 2 символів"}),
    phone: z.string()
        .length(17, {error: "Довжина номеру телефона має бути 17 символів"})
        .regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, {error: "Формат: +38(0XX)XXX-XX-XX"}),
    fullName: z.string().min(5, {error: "Вкажіть повне ПІБ отримувача (мінімум 5 символів)"})
});
//Схема поля details для доставки у відділення
const warehouseDetailsSchema = baseDeliveryDetailsSchema.extend({
    warehouse: z.string().min(1, {error: "Номер та адреса відділення має складатись не менше ніж з одного символу"}),
});
//Схема поля details для курєрської доставки
const courierDetailsSchema = baseDeliveryDetailsSchema.extend({
    street: z.string().min(2, {error: "Назва вулиці має містити не менше двох символів"}),
    houseNumber: z.coerce.number().int().positive()
});

//Основна схема доставки (Delivery)
const deliverySchema = z.discriminatedUnion("method", [
    baseDeliverySchema.extend({
        method: z.enum([deliveryMethodSchema.enum.NOVA_POSHTA, deliveryMethodSchema.enum.UKRPOSHTA]),
        details: warehouseDetailsSchema
    }),
    baseDeliverySchema.extend({
        method: z.literal(deliveryMethodSchema.enum.COURIER),
        details: courierDetailsSchema
    })
]);
export type Delivery = z.infer<typeof deliverySchema>;


//INPUT
export const createDeliveryDtoSchema = z.discriminatedUnion("method", [
    z.object({
        method: z.enum([deliveryMethodSchema.enum.NOVA_POSHTA, deliveryMethodSchema.enum.UKRPOSHTA]),
        details: warehouseDetailsSchema
    }),
    z.object({
        method: z.literal(deliveryMethodSchema.enum.COURIER),
        details: courierDetailsSchema
    })
]);
export type CreateDeliveryDto = z.infer<typeof createDeliveryDtoSchema>;


//OUTPUT
export const deliveryResponseSchema = deliverySchema;
export type DeliveryResponse = z.infer<typeof deliveryResponseSchema>;