import {
    type UserRole, userRoleSchema,
    type UserWithoutPassword,
    userWithoutPasswordSchema
} from "../models/user.ts";
import {z} from "zod";
import {type PaginationResponse, paginationResponseSchema} from "./paginationDTO.types.ts";


export type FetchAuthUserResponse  = UserWithoutPassword;
export const fetchAuthUserResponseSchema = userWithoutPasswordSchema;

export interface GetUsersListResponse extends PaginationResponse {
    content: UserWithoutPassword[];
    roles: UserRole[];
}
export const getUsersListResponseSchema = paginationResponseSchema.extend({
    content: z.array(userWithoutPasswordSchema),
    roles: z.array(userRoleSchema),
})