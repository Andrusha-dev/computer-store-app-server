import type {IUserService} from "./user.service.contract.ts";
import {
    type UserEntity, type UserFullEntity,
} from "../domain/user.entity.ts";
import type {IUserRepository} from "../domain/user.repository.contract.ts";
import type {IHashProvider} from "../../../shared/contracts/hash.contract.ts";
import type {
    CreateUserDto,
    UpdateUserDto,
    UserFullResponse,
    UserResponse,
    UsersQuery,
    UsersResponse
} from "../api/user.dto.ts";
import {NotFoundError, UnauthorizedError} from "../../../shared/error/custom.errors.ts";
import {toUserFullResponse, toUserResponse, toUsersResponse} from "../api/user.mapper.ts";
import {Prisma} from "@prisma/client";
import {toUserCreateInput, toUserFindManyArgs, toUserUpdateInput} from "./user.mapper.ts";
import type {PaginationMeta} from "../../../shared/schemas/pagination.schema.ts";
import {createPaginationMeta} from "../../../shared/utils/pagination.utils.ts";







interface Dependencies {
    hashProvider: IHashProvider;
    userRepository: IUserRepository;
}

export class UserService implements IUserService {
    private readonly hashProvider: IHashProvider;
    private readonly userRepository: IUserRepository;


    constructor({hashProvider, userRepository}: Dependencies) {
        this.hashProvider = hashProvider;
        this.userRepository = userRepository;
    }

    //Сервісний метод для отримання користувача без реляцій. Використовується в адмінці
    findById = async (id: number): Promise<UserResponse> => {
        const user: UserEntity | null = await this.userRepository.findById(id);

        if(!user) {
            throw new NotFoundError(`Користувача з ID ${id} не знайдено`)
        }

        const response: UserResponse = toUserResponse(user);

        return response;
    }

    //сервісний метод для отримання поточного автентифікованого користувача з реляціями
    findFullById = async (id: number): Promise<UserFullResponse> => {
        const user: UserFullEntity | null = await this.userRepository.findFullById(id);

        if(!user) {
            throw new NotFoundError(`Користувача з ID ${id} не знайдено`)
        }

        const response: UserFullResponse = toUserFullResponse(user);

        return response;
    }





    //Сервісний метод, який викликається модулем schemas під час автентифікації користувача
    findByEmail = async (email: string): Promise<UserResponse> => {
        const user: UserEntity | null = await this.userRepository.findByEmail(email);

        if(!user) {
            throw new NotFoundError(`Користувача з email ${email} не знайдено`)
        }

        return user;
    }


    //Сервісний метод для отримання списку користувачів без реляцій. Використовується в адмінці
    findMany =
        async (query: UsersQuery): Promise<UsersResponse> => {
            const args: Prisma.UserFindManyArgs = toUserFindManyArgs(query);

            const [users, totalElements] = await Promise.all([
                this.userRepository.findMany(args),
                //where дістаємо з args, щоб фільтри для findMany та count були синхронізовані
                this.userRepository.count(args.where)
            ]);

            const content: UserResponse[] = users.map(toUserResponse);
            const meta: PaginationMeta = createPaginationMeta(query.pageNo, query.pageSize, totalElements);

            const response: UsersResponse = toUsersResponse(content, meta);

            return response;
        }


    //Сервісний метод для пошуку та валідації користувача по email та password,
    //отриманих від AuthService, для перевірки автентифікації
    verifyCredentials =
        async (email: string, password: string): Promise<UserResponse> => {
            const user: UserEntity | null = await this.userRepository.findByEmail(email);
            console.log("Auth user: ", user);
            if(!user) {
                throw new UnauthorizedError("email або пароль невірні")
            }

            const isPasswordValid = await this.hashProvider.compare(password, user.password);
            if(!isPasswordValid) {
                throw new UnauthorizedError("email або пароль невірні");
            }

            const response: UserResponse = toUserResponse(user);

            return response;
        }

    create =
        async (dto: CreateUserDto): Promise<UserFullResponse> => {
            //Хешуємо пароль
            const passwordHash = await this.hashProvider.hash(dto.password);

            const data: Prisma.UserCreateInput = toUserCreateInput({
                ...dto,
                password: passwordHash
            });

            const user: UserFullEntity = await this.userRepository.create(data);

            const response: UserFullResponse = toUserFullResponse(user);

            return response;
        }

    update =
        async (id: number, dto: UpdateUserDto): Promise<UserFullResponse> => {
            const data: Prisma.UserUpdateInput = toUserUpdateInput(dto);

            const user: UserFullEntity = await this.userRepository.update(id, data);

            const response: UserFullResponse = toUserFullResponse(user);

            return response;
        }

    delete =
        async (id: number): Promise<UserFullResponse> => {
            const user: UserFullEntity = await this.userRepository.delete(id);

            const response: UserFullResponse = toUserFullResponse(user);

            return response;
        }
}