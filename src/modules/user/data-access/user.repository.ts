import type {
    IUserRepository,
    IncludedUserRelations,
    FindManyOptions,
    FindManyResult, CreatePayload
} from "../domain/user.repository.contract.ts";
import {
    type UserAuth, userAuthSchema,
    type UserEntity,
    userEntitySchema,
    type UserFull,
    userFullSchema
} from "../domain/user.entity.ts";
import type {User, UserWithRelations} from "../../../generated/zod";
import {NotFoundError, UnauthorizedError} from "../../../core/errors/custom.errors.ts";
import type {UserWhereInput} from "../../../generated/prisma/models/User.ts";
import {toUserCreateInput, toUserInclude, toUserWhereInput} from "./user.mapper.ts";
import type {UserRole} from "../../../shared/auth/auth.schema.ts";
import type {PrismaClient} from "../../../generated/prisma/client.ts";



interface Dependencies {
    prisma: PrismaClient;
}


export class UserRepository implements IUserRepository {
    private readonly prisma: PrismaClient;

    constructor({prisma}: Dependencies) {
        this.prisma = prisma;
    }

    async findById(id: number): Promise<UserEntity | null> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });

        if(!user) {
            return null;
        }

        const userEntity: UserEntity = userEntitySchema.parse(user);

        return userEntity;
    }

    async findByIdOrThrow(id: number): Promise<UserEntity> {
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundError(`Користувача з ID ${id} не знайдено`);
        }

        return user;
    }

    async findFullById(id: number, relations: IncludedUserRelations): Promise<UserFull | null> {
        const include = toUserInclude(relations);

        const user: UserWithRelations | null = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            include
        });

        if(!user) {
            return null;
        }

        const userFull: UserFull = userFullSchema.parse(user);

        return userFull;
    }

    async findFullByIdOrThrow(id: number, relation: IncludedUserRelations): Promise<UserFull> {
        const user = await this.findFullById(id, relation);

        if(!user) {
            throw new NotFoundError(`Користувача з ID ${id} не знайдено`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if(!user) {
            return null;
        }

        const userEntity: UserEntity = userEntitySchema.parse(user);

        return userEntity;
    }

    async findByEmailOrThrow(email: string): Promise<UserEntity> {
        const user = await this.findByEmail(email);

        if (!user) {
            throw new NotFoundError(`Користувача з email ${email} не знайдено`);
        }

        return user;
    }

    async findForAuthByEmail(email: string): Promise<UserAuth | null> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if (!user) {
           return null;
        }

        const userAuth: UserAuth = userAuthSchema.parse(user);

        return userAuth;
    }

    async findForAuthByEmailOrThrow(email: string): Promise<UserAuth> {
        const user = await this.findForAuthByEmail(email);

        if (!user) {
            throw new UnauthorizedError("Email або пароль не вірні")
        }

        return user;
    }


    async findMany(options: FindManyOptions): Promise<FindManyResult> {
        const {pageNo, pageSize, sortOrder, sortType, ...userFilters} = options;

        const where: UserWhereInput = toUserWhereInput(userFilters);

        const [users, totalElements, rolesGrouped] = await Promise.all([
            //Отримуємо відфільтрованих, відсортованих та зпагінованих користувачів
            this.prisma.user.findMany({
                where,
                //include: { address: true },
                orderBy: {
                    [sortType]: sortOrder
                },
                take: pageSize,
                skip: pageNo * pageSize,
            }),
            //Отримуємо кількість користувачів після фільтрації
            this.prisma.user.count({ where }),
            // Отримуємо групи користувачів з фактичними унікальними ролями для цих фільтрів (БЕЗ пагінації)
            // Це дасть нам список усіх ролей, які існують для поточного пошуку
            this.prisma.user.groupBy({
                where,
                by: ["role"],
            }),
        ]);

        const userEntities = users.map(user => {
            const userEntity: UserEntity = userEntitySchema.parse(user);

            return userEntity;
        });

        const actualRoles: UserRole[] = rolesGrouped.map(group => group.role);

        const result: FindManyResult = {
            content: userEntities,
            roles: actualRoles,
            totalElements: totalElements
        }

        return result;
    }

    async create(createPayload: CreatePayload, relations: IncludedUserRelations): Promise<UserFull> {
        const data = toUserCreateInput(createPayload);
        const include = toUserInclude(relations);

        const user = await this.prisma.user.create({
            data,
            include
        });

        const userFull: UserFull = userFullSchema.parse(user);

        return userFull;
    }

}
