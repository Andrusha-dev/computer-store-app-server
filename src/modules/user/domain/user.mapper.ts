import type {CreateUserPayload, GetUsersListOptions} from "./user.contract.ts";
import type {CreatePayload, FindManyOptions} from "./user.repository.contract.ts";



export const toCreatePayload =
    (createUserPayload: CreateUserPayload): CreatePayload => {
        const createPayload: CreatePayload = {
            ...createUserPayload,
        }

        return createPayload;
    }

export const toFindManyOptions =
    (getUsersListOptions: GetUsersListOptions): FindManyOptions => {
        const findManyOptions: FindManyOptions = {
            ...getUsersListOptions,
        }

        return findManyOptions;
    }

