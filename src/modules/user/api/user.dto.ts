import {z} from "zod";
import {paginationQuerySchema, paginationResponseSchema} from "../../../shared/pagination/api/pagination.dto.ts";
import {
    baseAddressSchema,
    //baseUserRelationsSchema,
    baseUserSchema,
    userFiltersSchema,
    userSortTypeSchema,
} from "../user.schema.ts";
import {userRoleSchema} from "../../../shared/auth/auth.schema.ts";



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



