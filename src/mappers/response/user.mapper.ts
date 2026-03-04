import type {
    CreateUserResponse,
    FetchAuthUserResponse,
    GetUsersListResponse,
    UserResponse
} from "../../types/dto/userDTO.types.ts";
import type {
    GetUsersListResult
} from "../../types/services/results/user.results.ts";
import type {UserWithAddress} from "../../types/models/custom/user.model.ts";

//Метод приведення моделі користувача до UserResponse, який використовується в інших мапперах
export const toUserResponse = (user: UserWithAddress): UserResponse => {
    //Відокремлюємо лишні поля (password, addressId), а також поле address
    const {id, email, username, firstname, lastname, phone, birthYear, profession, isMarried, role, address} = user;

    //Перед маппінгом слід бути впевненим що user отримано з CreateUserResult, де була перевірка на обовязкову наявність поля address
    const userResponse: UserResponse = {
        id,
        email,
        username,
        firstname,
        lastname,
        phone,
        birthYear,
        profession,
        isMarried,
        role,
        address: {
            city: address.city,
            street: address.street,
            houseNumber: address.houseNumber
        }
    }

    return userResponse;
}

export const toCreateUserResponse = (userWithAddress: UserWithAddress): CreateUserResponse => {
    //Типи CreateUserResponse та UserResponse є однаковими
    const createUserResponse: CreateUserResponse = toUserResponse(userWithAddress);

    return createUserResponse;
};

export const toFetchAuthUserResponse = (userWithAddress: UserWithAddress): FetchAuthUserResponse => {
    //Типи FetchAuthUserResponse та UserResponse є однаковими
    const fetchAuthUserResponse: FetchAuthUserResponse = toUserResponse(userWithAddress);

    return fetchAuthUserResponse;
};

export const toGetUsersListResponse = (getUsersListResult: GetUsersListResult): GetUsersListResponse => {
    const {content, totalElements, pageNo, pageSize, roles} = getUsersListResult;


    const totalPages = Math.ceil(totalElements / pageSize);
    const last = pageNo >= totalPages - 1;

    const getUsersListResponse: GetUsersListResponse = {
        content: content.map(toUserResponse),
        roles: roles,
        totalElements: totalElements,
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: totalPages,
        last: last
    }

    return getUsersListResponse;
}