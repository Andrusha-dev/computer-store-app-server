import type {
    IUserRepository,
} from "../../domain/user.repository.contract.ts";
import {
    type UserEntity,
    type UserFull, userFullInclude,
} from "../../domain/user.entity.ts";
import {NotFoundError} from "../../../../shared/error/custom.errors.ts";
import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service.ts";
import {Prisma} from "@prisma/client";
import {toUserWhereInput} from "./user.mapper.ts";
import type {FindManyOptions, FindManyResult} from "../../../../shared/types/repository.types.ts";
import type {PaginationMeta} from "../../../../shared/schemas/pagination.schema.ts";
import {createPaginationMeta} from "../../../../shared/utils/pagination.utils.ts";
import type {UserFilters, UserSortType} from "../../domain/user.types.ts";






interface Dependencies {
    dbService: PrismaService;
}


export class UserRepository implements IUserRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findById = async (id: number): Promise<UserEntity | null> => {
        const user: UserEntity | null = await this.dbService.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user) {
            return null;
        }

        return user;
    }

    findByIdOrThrow = async (id: number): Promise<UserEntity> => {
        const user: UserEntity | null = await this.findById(id);

        if (!user) {
            throw new NotFoundError(`Користувача з ID ${id} не знайдено`);
        }

        return user;
    }

    findFullById = async (id: number): Promise<UserFull | null> => {
        const user: UserFull | null = await this.dbService.user.findUnique({
            where: {
                id: id,
            },
            include: userFullInclude
        });

        if(!user) {
            return null;
        }

        return user;
    }

    findFullByIdOrThrow = async (id: number): Promise<UserFull> => {
        const user: UserFull | null = await this.findFullById(id);

        if(!user) {
            throw new NotFoundError(`Користувача з ID ${id} не знайдено`);
        }

        return user;
    }

    findByEmail = async (email: string): Promise<UserEntity | null> => {
        const user: UserEntity | null = await this.dbService.user.findUnique({
            where: {
                email: email,
            }
        });

        if(!user) {
            return null;
        }

        return user;
    }

    findByEmailOrThrow = async (email: string): Promise<UserEntity> => {
        const user: UserEntity | null = await this.findByEmail(email);

        if (!user) {
            throw new NotFoundError(`Користувача з email ${email} не знайдено`);
        }

        return user;
    }



    findMany =
        async (options: FindManyOptions<UserFilters, UserSortType>): Promise<FindManyResult<UserEntity>> => {
            const {filters, sortType, criteria} = options

            const where = toUserWhereInput(filters);

            const [users, totalElements] = await Promise.all([
                //Отримуємо відфільтрованих, відсортованих та зпагінованих користувачів
                this.dbService.user.findMany({
                    where,
                    //include: { address: true },
                    orderBy: {
                        [sortType]: criteria.sortOrder
                    },
                    take: criteria.pageSize,
                    skip: criteria.pageNo * criteria.pageSize,
                }),
                //Отримуємо кількість користувачів після фільтрації
                this.dbService.user.count({ where }),
            ]);

            const meta: PaginationMeta = createPaginationMeta(criteria.pageNo, criteria.pageSize, totalElements);


            const result: FindManyResult<UserEntity> = {
                content: users,
                meta: meta,
            }

            return result;
        }


    create =
        async (userCreateInput: Prisma.UserCreateInput): Promise<UserFull> => {
            const user: UserFull | null = await this.dbService.user.create({
                data: userCreateInput,
                include: userFullInclude
            });

            return user;
        }

}