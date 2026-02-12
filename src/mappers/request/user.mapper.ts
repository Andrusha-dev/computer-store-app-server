import type {GetUsersListQueryParams, UserFilters} from "../../types/params/userParams/userParams.types.ts";
import type {CreateUserArgs, FetchAuthUserArgs, GetUsersListArgs} from "../../types/services/args/user.args.ts";
import type {PageParams} from "../../types/params/pageParams/pageParams.types.ts";
import type {TokenPayload} from "../../types/dto/authDTO.types.ts";
import type {CreateUserRequest} from "../../types/dto/userDTO.types.ts";


export const toCreateUserArgs = (createUserRequest: CreateUserRequest): CreateUserArgs => {
    const createUserArgs: CreateUserArgs = {
        email: createUserRequest.email,
        password: createUserRequest.password,
        username: createUserRequest.username,
        firstname: createUserRequest.firstname,
        lastname: createUserRequest.lastname,
        address: createUserRequest.address,
        phone: createUserRequest.phone,
        birthYear: createUserRequest.birthYear,
        profession: createUserRequest.profession,
        isMarried: createUserRequest.isMarried
    }

    return createUserArgs;
}

export const toFetchAuthUserArgs = (tokenPayload: TokenPayload): FetchAuthUserArgs => {
    const fetchAuthUserArgs: FetchAuthUserArgs = {
        id: tokenPayload.id
    }

    return fetchAuthUserArgs;
}

export const toGetUsersListArgs = (getUsersListQueryParams: GetUsersListQueryParams): GetUsersListArgs => {
    const userFilters: UserFilters = {
        id: getUsersListQueryParams.id,
        firstname: getUsersListQueryParams.firstname,
        lastname: getUsersListQueryParams.lastname,
        roles: getUsersListQueryParams.roles
    }

    const pageParams: PageParams = {
        pageNo: getUsersListQueryParams.pageNo ?? 0,
        pageSize: getUsersListQueryParams.pageSize ?? 10,
        sortType: getUsersListQueryParams.sortType ?? "lastname",
        sortOrder: getUsersListQueryParams.sortOrder ?? "asc"
    }

    const getUsersListArgs: GetUsersListArgs = {
        userFilters,
        pageParams
    }

    return getUsersListArgs;
}

