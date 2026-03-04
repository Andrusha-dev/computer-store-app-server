import {
    type UserRole, type UserWithAddress
} from "../../models/custom/user.model.ts";



export interface GetUsersListResult {
    content: UserWithAddress[];
    roles: UserRole[];
    totalElements: number;
    pageNo: number;
    pageSize: number;
}

