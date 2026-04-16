import type {AuthenticatedUser, UserEntity} from "../domain/user.entity.ts";
import type {GetUsersListQuery} from "../api/user.dto.ts";
import type {FindManyOptions} from "../../../shared/types/repository.types.ts";
import type {UserFilters, UserSortType} from "../domain/user.repository.contract.ts";
import type {PaginationCriteria} from "../../../shared/dtos/pagination/pagination.schema.ts";






export const toAuthenticatedUser = (user: UserEntity): AuthenticatedUser => {
    const authenticatedUser: AuthenticatedUser = {
        id: user.id,
        email: user.email,
        role: user.role,
    }

    return authenticatedUser;
}


export const toFindManyOptions =
    (getUsersListQuery: GetUsersListQuery): FindManyOptions<UserFilters, UserSortType> => {
        const userFilters: UserFilters = {
            id: getUsersListQuery.id,
            firstname: getUsersListQuery.firstname,
            lastname: getUsersListQuery.lastname,
            roles: getUsersListQuery.roles,
        }

        const userSortType: UserSortType = getUsersListQuery.sortType;

        const paginationCriteria: PaginationCriteria = {
            pageNo: getUsersListQuery.pageNo,
            pageSize: getUsersListQuery.pageSize,
            sortOrder: getUsersListQuery.sortOrder,
        }


        const findManyOptions: FindManyOptions<UserFilters, UserSortType> = {
            filters: userFilters,
            sortType: userSortType,
            criteria: paginationCriteria,
        }

        return findManyOptions;
    }

