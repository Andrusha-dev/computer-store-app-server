import type {UserWithRelations} from "../../types/models/generated";
import type {
    CreateUserResponse,
    FetchAuthUserResponse,
    GetUsersListResponse,
    UserResponse
} from "../../types/dto/userDTO.types.ts";
import type {
    CreateUserResult,
    FetchAuthUserResult,
    GetUsersListResult
} from "../../types/services/results/user.results.ts";

export const toUserResponse = (userWithRelations: UserWithRelations): UserResponse => {
    //Відокремлюємо лишні поля (password, addressId), а також поле address
    const { password, addressId, address, ...rest } = userWithRelations;

    return {
        ...rest,
        address: {
            city: address!.city,
            street: address!.street,
            houseNumber: address!.houseNumber
        }
    };
}

export const toCreateUserResponse = (createUserResult: CreateUserResult): CreateUserResponse => {
    //Типи CreateUserResponse та UserResponse є однаковими
    const createUserResponse: CreateUserResponse = toUserResponse(createUserResult.userWithRelations);

    return createUserResponse;
};

export const toFetchAuthUserResponse = (fetchAuthUserResult: FetchAuthUserResult): FetchAuthUserResponse => {
    //Типи FetchAuthUserResponse та UserResponse є однаковими
    const fetchAuthUserResponse: FetchAuthUserResponse = toUserResponse(fetchAuthUserResult.userWithRelations);

    return fetchAuthUserResponse;
};

export const toGetUsersListResponse = (getUsersListResult: GetUsersListResult): GetUsersListResponse => {
    const {paginatedUsers, totalElements, pageNo, pageSize, roles} = getUsersListResult;


    const totalPages = Math.ceil(totalElements / pageSize);
    const last = pageNo >= totalPages - 1;

    const getUsersListResponse: GetUsersListResponse = {
        content: paginatedUsers.map(toUserResponse),
        totalElements: totalElements,
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: totalPages,
        roles: roles ?? [],
        last: last
    }

    return getUsersListResponse;
}