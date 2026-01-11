import type {User, UserRole, UserWithoutPassword} from "../types/models/user.ts";
import {users} from "../data/users.ts";
import {
    type FetchAuthUserResponse, fetchAuthUserResponseSchema,
    type GetUsersListResponse, getUsersListResponseSchema,

} from "../types/dto/userDTO.types.ts";
import type {GetUsersListParams, ParsedUsersParams, UserFilters} from "../types/params/userParams/userParams.types.ts";
import type {PageParams, QueryPageParams} from "../types/params/pageParams/pageParams.types.ts";

//сервісний метод для отримання даних поточного автентифікованого користувача типу FetchAuthUserResponse
export const fetchAuthUser = (id: number): FetchAuthUserResponse | null => {
    const user: User | undefined = users.find((user) => user.id === id);

    if(!user) {
        return null;
    }

    const {password, ...fetchAuthUserResponse} = user

    const validatedFetchAuthUserResponse: FetchAuthUserResponse = fetchAuthUserResponseSchema.parse(fetchAuthUserResponse);
    return validatedFetchAuthUserResponse;
}


export const parseUsersParams = (getUsersListParams: GetUsersListParams): ParsedUsersParams => {
    const {
        pageNo = 0,
        pageSize = 10,
        sortType = "lastname",
        sortOrder = "asc",
        ...userFilters
    } = getUsersListParams

    const pageParams: PageParams = {
        pageNo,
        pageSize,
        sortType,
        sortOrder
    }

    const parsedUsersParams: ParsedUsersParams = {
        userFilters,
        pageParams
    }

    return parsedUsersParams;
}

export const fetchUsers = (userFilters: UserFilters): UserWithoutPassword[] => {
    let usersWithoutPassword: UserWithoutPassword[] = users.map((user) => {
        const {password, ...userWithoutPassword} = user;
        return userWithoutPassword;
    });


    if(userFilters.id !== undefined) {
       usersWithoutPassword = usersWithoutPassword.filter((user) => user.id === userFilters.id);
    }

    if(userFilters.firstname !== undefined) {
        const firstname: string = userFilters.firstname;
        usersWithoutPassword = usersWithoutPassword.filter((user) =>
            user.firstname.toLowerCase().includes(firstname.toLowerCase()));
    }

    if(userFilters.lastname !== undefined) {
        const lastname: string = userFilters.lastname;
        usersWithoutPassword = usersWithoutPassword.filter((user) =>
            user.lastname.toLowerCase().includes(lastname.toLowerCase()));
    }

    if(userFilters.roles !== undefined) {
        const roles: UserRole[] = userFilters.roles;
        usersWithoutPassword = usersWithoutPassword.filter((user) => roles.includes(user.role));
    }

    return usersWithoutPassword;
}


export const paginateUsers = (
    usersWithoutPassword: UserWithoutPassword[],
    pageParams: PageParams
): UserWithoutPassword[] => {
    let paginatedUsersWithoutPassword: UserWithoutPassword[] = [...usersWithoutPassword];

    if(paginatedUsersWithoutPassword.length === 0) {
        return paginatedUsersWithoutPassword;
    }


    if(pageParams.sortType === "firstname" && pageParams.sortOrder === "asc") {
        paginatedUsersWithoutPassword = paginatedUsersWithoutPassword.sort((a, b) =>
            a.firstname.localeCompare(b.firstname));
    }
    if(pageParams.sortType === "firstname" && pageParams.sortOrder === "desc") {
        paginatedUsersWithoutPassword = paginatedUsersWithoutPassword.sort((a, b) =>
            b.firstname.localeCompare(a.firstname));
    }
    if(pageParams.sortType === "lastname" && pageParams.sortOrder === "asc") {
        paginatedUsersWithoutPassword = paginatedUsersWithoutPassword.sort((a, b) =>
            a.lastname.localeCompare(b.lastname));
    }
    if(pageParams.sortType === "lastname" && pageParams.sortOrder === "desc") {
        paginatedUsersWithoutPassword = paginatedUsersWithoutPassword.sort((a, b) =>
            b.lastname.localeCompare(b.lastname));
    }


    const startIndex: number = (((pageParams.pageNo + 1) * pageParams.pageSize) - pageParams.pageSize);
    console.log(`start index for page ${pageParams.pageNo}: `, startIndex);
    paginatedUsersWithoutPassword = paginatedUsersWithoutPassword.splice(startIndex, pageParams.pageSize);


    return paginatedUsersWithoutPassword;
}


export const getUsersList = (getUsersListParams: GetUsersListParams): GetUsersListResponse => {
    const {userFilters, pageParams} = parseUsersParams(getUsersListParams);

    const filteredUsersWithoutPassword: UserWithoutPassword[] = fetchUsers(userFilters);

    const uniqueUserRoles: UserRole[] = Array.from(new Set(filteredUsersWithoutPassword.map((u) => u.role)));

    const paginatedUsersWithoutPassword: UserWithoutPassword[] = paginateUsers(filteredUsersWithoutPassword, pageParams);

    const pageNo: number = pageParams.pageNo;
    const pageSize: number = pageParams.pageSize;
    const totalElements: number = filteredUsersWithoutPassword.length;
    const totalPages: number = Math.ceil(totalElements / pageSize);
    const last: boolean = (pageParams.pageNo) === (totalPages - 1);


    const getUsersListResponse: GetUsersListResponse = {
        content: paginatedUsersWithoutPassword,
        roles: uniqueUserRoles,
        pageNo: pageNo,
        pageSize: pageSize,
        totalElements: totalElements,
        totalPages: totalPages,
        last: last
    }

    //Валідуєм дані
    const validatedGetUsersListResponse: GetUsersListResponse = getUsersListResponseSchema.parse(getUsersListResponse);
    return validatedGetUsersListResponse;
}
