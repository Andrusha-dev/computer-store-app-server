import {z} from "zod";
import {userRoleSchema} from "../../../shared/schemas/user-role.schema.ts";
import {arrayPreprocess} from "../../../api/helpers/validation.helpers.ts";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/dtos/pagination/pagination.schema.ts";




//БАЗОВІ СХЕМИ
//Базова схема адреси користувача (реляція)
export const addressSchema = z.object({
    city: z.string(),
    street: z.string(),
    houseNumber: z.number().int(),
});


//Базова схема користувача
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


//Схема для способу сортування користувачів
export const userSortTypeSchema = z.object({
    //Обєднаний тип на основі вибраних полів користувача. Значення за змовчуванням lastname
    sortType: userSchema
        .pick({ firstname: true, lastname: true })
        .keyof()
        .default("lastname"),
});

//Схема для фільтрів користувача
export const userFiltersSchema = z.object({
    id: z.coerce.number().int().positive().optional(),
    firstname: z.coerce.string().optional(),
    lastname: z.coerce.string().optional(),
    roles: z.preprocess(arrayPreprocess, z.array(userRoleSchema)).optional()
});





//DTO
export const createUserDtoSchema = userSchema
    .omit({
        id: true,
        role: true,
    })
    .extend({
        address: addressSchema
    });
export interface CreateUserDto extends z.infer<typeof createUserDtoSchema> {}

export const createUserResponseSchema = userSchema
    .omit({
        password: true,
    })
    .extend({
        //Тут address не може бути null, оскільки в теперішній реалізації
        // користувач точно створюється разом з адресою(це одна транзакція)
        address: addressSchema
    });
export interface CreateUserResponse extends z.infer<typeof createUserResponseSchema> {}




export const fetchAuthUserResponseSchema = userSchema
    .omit({
        password: true,
    })
    .extend({
        //Тут наявність address може бути null, для випадків, коли користувачі могли бути створені без адрес
        //і відсутність фактичної адреси в даному сценарії не критична
        address: addressSchema.nullable()
    });
export interface FetchAuthUserResponse extends z.infer<typeof fetchAuthUserResponseSchema> {}




export const fetchUserByIdParamsSchema = z.object({
    id: z.coerce.number().int().positive()
});
export interface FetchUserByIdParams extends z.infer<typeof fetchUserByIdParamsSchema> {}

export const fetchUserByIdResponseSchema = userSchema
    .omit({
        password: true,
    });
export interface FetchUserByIdResponse extends z.infer<typeof fetchUserByIdResponseSchema> {}




export const getUsersListQuerySchema = paginationCriteriaSchema
    .extend(userSortTypeSchema.shape)
    .extend(userFiltersSchema.shape);
export interface GetUsersListQuery extends z.infer<typeof getUsersListQuerySchema> {}

export const getUsersListResponseSchema = paginationMetaSchema.extend({
    content: z.array(
        userSchema.omit({
            password: true,
        })),
});
export interface GetUsersListResponse extends z.infer<typeof getUsersListResponseSchema> {}









/*
//Технічна схема валідації користувача без реляцій для response
const userResponseSchema = baseUserSchema
    .omit({
        password: true
    });

//Технічна схема валідації користувача без реляцій для dto
const userDtoSchema = baseUserSchema
    .omit({
        id: true,
        role: true
    });



export const createUserDtoSchema = userDtoSchema
    .extend({
        address: baseAddressSchema
    });
export interface CreateUserDto extends z.infer<typeof createUserDtoSchema> {}

export const createUserResponseSchema = userResponseSchema
    .extend({
        //Тут address не може бути null, оскільки в теперішній реалізації
        // користувач точно створюється разом з адресою(це одна транзакція)
        address: baseAddressSchema
    });
export interface CreateUserResponse extends z.infer<typeof createUserResponseSchema> {}




export const fetchAuthUserResponseSchema = userResponseSchema
    .extend({
        //Тут наявність address може бути null, для випадків, коли користувачі могли бути створені без адрес
        //і відсутність фактичної адреси в даному сценарії не критична
        address: baseAddressSchema.nullable()
    });
export interface FetchAuthUserResponse extends z.infer<typeof fetchAuthUserResponseSchema> {}




export const fetchUserByIdParamsSchema = z.object({
    id: z.coerce.number().int().positive()
});
export interface FetchUserByIdParams extends z.infer<typeof fetchUserByIdParamsSchema> {}

export const fetchUserByIdResponseSchema = userResponseSchema;
export interface FetchUserByIdResponse extends z.infer<typeof fetchUserByIdResponseSchema> {}




export const getUsersListQuerySchema = paginationQuerySchema
    .extend(userSortTypeSchema.shape)
    .extend(userFiltersSchema.shape);
export interface GetUsersListQuery extends z.infer<typeof getUsersListQuerySchema> {}

export const getUsersListResponseSchema = paginationResponseSchema.extend({
    content: z.array(userResponseSchema),
    roles: z.array(userRoleSchema),
});
export interface GetUsersListResponse extends z.infer<typeof getUsersListResponseSchema> {}
*/


