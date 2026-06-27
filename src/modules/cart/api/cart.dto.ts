import {z} from "zod";
import {productResponseSchema} from "../../product/index";



//ОСНОВНІ СХЕМИ (БУДІВЕЛЬНІ БЛОКИ)
//Основна схема для Cart
export const cartSchema = z.object({
   id: z.number().int().positive(),
});


//Основна схема для CartItem (реляція)
export const cartItemSchema = z.object({
    id: z.number().int().positive(),
    quantity: z.coerce.number().int().min(1, "кількість товару має бути не менше 1"),
    cartId: z.coerce.number().int().positive("ID кошика має бути позитивним числом"),
    productId: z.coerce.number().int().positive("ID товару має бути позитивним числом"),
});



//INPUT
export const createCartItemDtoSchema = cartItemSchema
    //productId передаємо в тілі запиту, а не в параметрі url, бо це post запит
    .pick({productId: true, quantity: true});
export type CreateCartItemDto = z.infer<typeof createCartItemDtoSchema>;

export const updateCartItemQuantityDtoSchema = cartItemSchema
    //productId передаємо через параметри url, бо це patch запит.
    //Оновлення CartItem передбачає лише оновлення поля quantity
    .pick({quantity: true});
export type UpdateCartItemQuantityDto = z.infer<typeof updateCartItemQuantityDtoSchema>;

export const cartItemParamsSchema = z.object({
    productId: z.coerce.number().int().positive()
});
export type CartItemParams = z.infer<typeof cartItemParamsSchema>;



//OUTPUT
//Тип для повернення cartItem, який має містити реляцію product, щоб фронтенд на сторінці кошика міг відобразити дані про товар
export const cartItemFullResponseSchema = cartItemSchema
    .extend({
        product: productResponseSchema
    });
export type CartItemFullResponse = z.infer<typeof cartItemFullResponseSchema>;

export const cartFullResponseSchema = cartSchema.extend({
    items: z.array(cartItemFullResponseSchema)
});
export type CartFullResponse = z.infer<typeof cartFullResponseSchema>;




