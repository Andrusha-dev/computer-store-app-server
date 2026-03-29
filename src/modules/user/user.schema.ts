//import {AddressSchema, UserRoleSchema, UserSchema} from "../../generated/zod/index.ts";
import {z} from "zod";
import {arrayPreprocess} from "../../shared/validation/validation.helpers.ts";
import {userRoleSchema} from "../../shared/auth/auth.schema.ts";



//ТЕХНІЧНІ СУТНОСТІ
//Технічна сутність адреси користувача (реляція)
export const baseAddressSchema = z.object({
    city: z.string(),
    street: z.string(),
    houseNumber: z.number().int(),
});
export interface BaseAddress extends z.infer<typeof baseAddressSchema>{}

//Технічна сутність користувача
export const baseUserSchema = z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string()
        .length(17, "Довжина номеру телефона має бути 17 символів")
        .regex(/^\+38\(0\d{2}\)\d{3}-\d{2}-\d{2}$/, "Формат: +38(0XX)XXX-XX-XX"),
    birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
    profession: z.string(),
    isMarried: z.boolean(),
    role: userRoleSchema,
});
export interface BaseUser extends z.infer<typeof baseUserSchema>{}




//ДОПОМІЖНІ ТИПИ
//Тип для параметрів запиту (спосіб сортування користувачів)
export const userSortTypeSchema = z.object({
    //Обєднаний тип на основі вибраних полів користувача. Значення за змовчуванням lastname
    sortType: baseUserSchema
        .pick({ firstname: true, lastname: true })
        .keyof()
        .default("lastname"),
});
export interface UserSortType extends z.infer<typeof userSortTypeSchema>{}

//Тип для параметрів запиту (фільтри)
export const userFiltersSchema = z.object({
    id: z.coerce.number().int().positive().optional(),
    firstname: z.coerce.string().optional(),
    lastname: z.coerce.string().optional(),
    roles: z.preprocess(arrayPreprocess, z.array(userRoleSchema)).optional()
});
export interface UserFilters extends z.infer<typeof userFiltersSchema>{}

