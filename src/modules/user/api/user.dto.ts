import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema.ts";
import {arrayPreprocess} from "../../../shared/utils/validation.utils.ts";
import {userRoleSchema} from "../../../shared/schemas/user-role.schema.ts";





//ОСНОВНІ СХЕМИ (БУДІВЕЛЬНІ БЛОКИ)
//Основна схема користувача
export const userSchema = z.object({
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

//Основна схема адреси користувача (реляція)
export const addressSchema = z.object({
    city: z.string(),
    street: z.string(),
    houseNumber: z.number().int(),
});






//INPUT
//Базова схема для dto
const baseUserDtoSchema = userSchema.omit({id: true, role: true});

//Схема вхідного dto для створення користувача
export const createUserDtoSchema = baseUserDtoSchema
    .extend({
        address: addressSchema
    });
export type CreateUserDto = z.infer<typeof createUserDtoSchema>;


//Схема для оновлення User
export const updateUserDtoSchema = baseUserDtoSchema
    .extend({
        address: addressSchema.partial()
    })
    .partial();
export type UpdateUserDto = z.infer<typeof updateUserDtoSchema>;

//Схема параметрів url для отримання користувача по id
export const userParamsSchema = z.object({
    id: z.coerce.number().int().positive()
});
export type UserParams = z.infer<typeof userParamsSchema>;


//Схема для фільтрів користувача
export const userFiltersSchema = z.object({
    firstname: z.coerce.string().optional(),
    lastname: z.coerce.string().optional(),
    roles: z.preprocess(arrayPreprocess, z.array(userRoleSchema)).optional()
});
export type UserFilters = z.infer<typeof userFiltersSchema>;
//Схема для типу сортування користувача
export const userSortTypeSchema = userSchema
    .pick({ firstname: true, lastname: true })
    .keyof()
    .default("lastname")
export type UserSortType = z.infer<typeof userSortTypeSchema>;
//Схема для параметрів запиту списку користувачів
export const usersQuerySchema = paginationCriteriaSchema
    .extend({
        sortType: userSortTypeSchema
    })
    .extend(userFiltersSchema.shape);
export type UsersQuery = z.infer<typeof usersQuerySchema>;



//OUTPUT
//Базова схема для response
const baseUserResponseSchema = userSchema.omit({password: true});

//Схема dto відповіді без реляцій (підходить для експорту в інші модулі)
export const userResponseSchema = baseUserResponseSchema;
export type UserResponse = z.infer<typeof userResponseSchema>;

//Схема dto відповіді з реляціями
export const userFullResponseSchema = baseUserResponseSchema
    .extend({
        address: addressSchema.nullable()
    });
export type UserFullResponse = z.infer<typeof userFullResponseSchema>;

//Схема dto відповіді зі списком користувачів та метаданими
export const usersResponseSchema = z.object({
    content: z.array(userResponseSchema),
    meta: paginationMetaSchema,
});
export type UsersResponse = z.infer<typeof usersResponseSchema>;




