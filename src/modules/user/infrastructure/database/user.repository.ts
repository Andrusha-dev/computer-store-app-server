import type {
    IUserRepository,
} from "../../domain/user.repository.contract";
import {
    type UserEntity, type UserFullEntity, userInclude,
} from "../../domain/user.entity";
import type {PrismaService} from "../../../../shared/infrastructure/database/prisma.service";
import {Prisma} from "../../../../../prisma/generated/client";






interface Dependencies {
    dbService: PrismaService;
}


export class UserRepository implements IUserRepository {
    private readonly dbService: PrismaService;

    constructor({dbService}: Dependencies) {
        this.dbService = dbService;
    }

    findById =
        async (id: number): Promise<UserEntity | null> => {
            const user: UserEntity | null = await this.dbService.user.findUnique({
                where: {
                    id: id
                }
            });

            return user;
        }

    findFullById =
        async (id: number): Promise<UserFullEntity | null> => {
            const user: UserFullEntity | null = await this.dbService.user.findUnique({
                where: {
                    id: id,
                },
                include: userInclude
            });

            return user;
        }

    findByEmail =
        async (email: string): Promise<UserEntity | null> => {
            const user: UserEntity | null = await this.dbService.user.findUnique({
                where: {
                    email: email,
                }
            });

            return user;
        }

    findMany =
        async (args: Prisma.UserFindManyArgs): Promise<UserEntity[]> => {
            const users: UserEntity[] = await this.dbService.user.findMany(args);

            return users;
        }

    count = async (where?: Prisma.UserWhereInput): Promise<number> => {
        const count: number = await this.dbService.user.count({where});

        return count;
    }


    create =
        async (data: Prisma.UserCreateInput): Promise<UserFullEntity> => {
            const user: UserFullEntity = await this.dbService.user.create({
                data: data,
                include: userInclude
            });

            return user;
        }

    update =
        async (id: number, data: Prisma.UserUpdateInput): Promise<UserFullEntity> => {
            const user: UserFullEntity = await this.dbService.user.update({
                where: {
                    id: id
                },
                data: data,
                include: userInclude
            });

            return user;
        }

    delete = async (id: number): Promise<UserFullEntity> => {
        const user: UserFullEntity = await this.dbService.user.delete({
            where: {
                id: id
            },
            include: userInclude
        });

        return user;
    }

}