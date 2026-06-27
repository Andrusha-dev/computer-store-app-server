import type {UserEntity, UserFullEntity} from "./user.entity.ts";
import {Prisma} from "../../../../prisma/generated/client.ts";





export interface IUserRepository {
    findById: (id: number) => Promise<UserEntity | null>;
    findFullById: (id: number) => Promise<UserFullEntity | null>;
    findByEmail: (email: string) => Promise<UserEntity | null>;
    //Списки (завжди повертають масив, навіть порожній)
    findMany: (args: Prisma.UserFindManyArgs) => Promise<UserEntity[]>;
    count: (where?: Prisma.UserWhereInput) => Promise<number>;
    //Мутації (завжди повертають об'єкт, інакше - orm генерує помилку)
    create: (data: Prisma.UserCreateInput) => Promise<UserFullEntity>;
    update: (id: number, data: Prisma.UserUpdateInput) => Promise<UserFullEntity>;
    delete: (id: number) => Promise<UserFullEntity>;
}