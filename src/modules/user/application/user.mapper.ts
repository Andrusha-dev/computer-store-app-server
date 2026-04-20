import type {CreateUserDto, GetUsersListQuery} from "../api/user.dto.ts";
import type {FindManyOptions} from "../../../shared/types/repository.types.ts";
import type {PaginationCriteria} from "../../../shared/schemas/pagination.schema.ts";
import {Prisma} from "@prisma/client";
import type {UserFilters, UserSortType} from "../domain/user.types.ts";







//Маппер для перетворення контракту CreatePayload до обєкту UserCreateInput
export const toUserCreateInput = (createUserDto: CreateUserDto): Prisma.UserCreateInput => {
    const data: Prisma.UserCreateInput = {
        ...createUserDto,
        address: {
            create: createUserDto.address // Явне перетворення реляції
        }
    }

    return data;
};


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
