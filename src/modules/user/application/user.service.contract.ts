import type {
    CreateUserDto,
    UpdateUserDto,
    UserFullResponse,
    UserResponse,
    UsersQuery,
    UsersResponse
} from "../api/user.dto.ts";





export interface IUserService {
    findById: (id: number) => Promise<UserResponse>;
    findFullById: (id: number) => Promise<UserFullResponse>;
    findByEmail: (email: string) => Promise<UserResponse>;
    findMany: (query: UsersQuery) => Promise<UsersResponse>;
    verifyCredentials: (email: string, password: string) => Promise<UserResponse>
    create: (dto: CreateUserDto) => Promise<UserFullResponse>;
    update: (id: number, dto: UpdateUserDto) => Promise<UserFullResponse>;
    delete: (id: number) => Promise<UserFullResponse>;
}







