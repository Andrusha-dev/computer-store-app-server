import {z} from "zod";
import {baseAddressSchema, baseUserSchema} from "../user.schema.ts";




//БІЗНЕС СУТНОСТІ
//Бізнес тип для реляції address
export const addressEntitySchema = baseAddressSchema;
export interface AddressEntity extends z.infer<typeof addressEntitySchema>{}

// Універсальний бізнес тип без реляцій (Чиста, без пароля)
export const userEntitySchema = baseUserSchema.omit({ password: true });
export interface UserEntity extends z.infer<typeof userEntitySchema>{}

//Універсальний бізнес тип з опціональними реляціями
export const userFullSchema = userEntitySchema.extend({
    address: addressEntitySchema.nullish(),
    //orders: z.array(orderEntitySchema).optional(),
});
export interface UserFull extends z.infer<typeof userFullSchema>{}


// ТЕХНІЧНИЙ ТИП для Auth (Internal Only)
// Ми просто беремо baseUserSchema, де пароль ЩЕ Є
export const userAuthSchema = baseUserSchema
export interface UserAuth extends z.infer<typeof userAuthSchema> {}







/*
//Допоміжний тип для реляцій користувача, де кожна реляція може мати значення null або undefined
const userFlexibleRelationsSchema = z.object(
    Object.fromEntries(
        Object.entries(baseUserRelationsSchema.shape).map(([key, value]) => [
            key,
            value.optional().nullable(),
        ])
    )
);



//БІЗНЕС СУТНОСТІ
// Універсальний бізнес тип без реляцій (Чиста, без пароля)
export const userEntitySchema = baseUserSchema.omit({ password: true });
export interface UserEntity extends z.infer<typeof userEntitySchema>{}

//Універсальний бізнес тип з опціональними реляціями
export const userFullSchema = userEntitySchema.extend(userFlexibleRelationsSchema.shape);
export interface UserFull extends z.infer<typeof userFullSchema>{}
*/
