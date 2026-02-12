import {z} from "zod";
import {paginationResponseSchema} from "./paginationDTO.types.ts";
import {baseUserSchema, userRoleSchema} from "../models/custom/user.model.ts";

export const createUserRequestSchema = baseUserSchema.omit({ id: true, role: true});
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

//Базова схема для користувача, який повертається з сервера без привязки до конкретного метода.
//А далі використовується в необхідних схемах dto, щоб не дубюлювати одну і ту ж схему
export const userResponseSchema = baseUserSchema.omit({ password: true });
export type UserResponse = z.infer<typeof userResponseSchema>;

export const createUserResponseSchema = userResponseSchema;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;


export const fetchAuthUserResponseSchema = userResponseSchema;
export type FetchAuthUserResponse = z.infer<typeof fetchAuthUserResponseSchema>


export const getUsersListResponseSchema = paginationResponseSchema.extend({
    content: z.array(userResponseSchema),
    roles: z.array(userRoleSchema),
});
export type GetUsersListResponse = z.infer<typeof getUsersListResponseSchema>