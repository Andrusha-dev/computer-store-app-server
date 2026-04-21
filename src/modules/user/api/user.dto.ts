import {z} from "zod";
import {paginationCriteriaSchema, paginationMetaSchema} from "../../../shared/schemas/pagination.schema.ts";
import {addressSchema, userSchema} from "../domain/user.schema.ts";
import {arrayPreprocess} from "../../../shared/utils/validation.utils.ts";
import {userRoleSchema} from "../../../shared/schemas/user-role.schema.ts";









//INPUT
//Схема вхідного dto для створення користувача
export const createUserDtoSchema = userSchema
    .omit({
        id: true,
        role: true,
    })
    .extend({
        address: addressSchema
    });
export interface CreateUserDto extends z.infer<typeof createUserDtoSchema> {}


//Схема параметрів url для отримання користувача по id
export const fetchUserByIdParamsSchema = z.object({
    id: z.coerce.number().int().positive()
});
export interface FetchUserByIdParams extends z.infer<typeof fetchUserByIdParamsSchema> {}


//Схема для фільтрів користувача
export const userFiltersSchema = z.object({
    id: z.coerce.number().int().positive().optional(),
    firstname: z.coerce.string().optional(),
    lastname: z.coerce.string().optional(),
    roles: z.preprocess(arrayPreprocess, z.array(userRoleSchema)).optional()
});
export interface UserFilters extends z.infer<typeof userFiltersSchema> {}
//Схема для типу сортування користувача
export const userSortTypeSchema = userSchema
    .pick({ firstname: true, lastname: true })
    .keyof()
    .default("lastname")
export type UserSortType = z.infer<typeof userSortTypeSchema>;
//Схема для параметрів запиту списку користувачів
export const getUsersListQuerySchema = paginationCriteriaSchema
    .extend(userFiltersSchema.shape)
    .extend({
        sortType: userSortTypeSchema
    });
export interface GetUsersListQuery extends z.infer<typeof getUsersListQuerySchema> {}



//OUTPUT
//Схема dto відповіді без реляцій (підходить для експорту в інші модулі)
export const userResponseSchema = userSchema.omit({password: true});
export interface UserResponse extends z.infer<typeof userResponseSchema> {}

//Схема dto відповіді з реляціями
export const userFullResponseSchema = userResponseSchema.extend({
    address: addressSchema.nullable()
});
export interface UserFullResponse extends z.infer<typeof userFullResponseSchema> {}

//Схема dto відповіді зі списком користувачів та метаданими
export const userListResponseSchema = z.object({
    content: z.array(userResponseSchema),
    meta: paginationMetaSchema,
});
export interface UserListResponse extends z.infer<typeof userListResponseSchema> {}




