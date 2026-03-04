import {z} from "zod";
import {paginationResponseSchema} from "./paginationDTO.types.ts";
import {
    baseUserRelationsSchema,
    baseUserSchema,
    userRoleSchema,
} from "../models/custom/user.model.ts";



export const createUserRequestSchema = baseUserSchema
    .omit({ id: true, role: true})
    .extend({
        password: z.string().min(8, "Довжина паролю має бути не менше 8 символів"),
        address: baseUserRelationsSchema.shape.address
    });
export interface CreateUserRequest extends z.infer<typeof createUserRequestSchema>{}

//Базова схема для користувача, який повертається з сервера без привязки до конкретного метода.
//А далі використовується в необхідних схемах dto, щоб не дубюлювати одну і ту ж схему
export const userResponseSchema = baseUserSchema
    .extend({
        address: baseUserRelationsSchema.shape.address
    });
export interface UserResponse extends z.infer<typeof userResponseSchema>{}

export const createUserResponseSchema = userResponseSchema;
export interface CreateUserResponse extends z.infer<typeof createUserResponseSchema>{}


export const fetchAuthUserResponseSchema = userResponseSchema;
export interface FetchAuthUserResponse extends z.infer<typeof fetchAuthUserResponseSchema>{}


export const getUsersListResponseSchema = paginationResponseSchema.extend({
    content: z.array(userResponseSchema),
    roles: z.array(userRoleSchema),
});
export interface GetUsersListResponse extends z.infer<typeof getUsersListResponseSchema>{}