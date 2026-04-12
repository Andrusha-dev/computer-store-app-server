import type {CreateUserPayload, GetUsersListOptions, GetUsersListResult, IUserService} from "./user.service.contract.ts";
import {
    type AuthenticatedUser,
    type UserAuth,
    type UserEntity,
    type UserFull,
} from "../domain/user.entity.ts";
import {createPaginationResult} from "../../../shared/dtos/pagination/domain/pagination.helper.ts";
import {toCreatePayload, toFindManyOptions} from "./user.mapper.ts";
import type {IncludedUserRelations, IUserRepository} from "../domain/user.repository.contract.ts";
import type {IHashProvider} from "../../../shared/contracts/hash.contract.ts";





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

    async createUser(createUserPayload: CreateUserPayload): Promise<UserFull> {
        //Хешуємо пароль
        const hashedPassword = await this.hashProvider.hash(createUserPayload.password);

        const createPayload = toCreatePayload({
            ...createUserPayload,
            password: hashedPassword,
        });
        const includedUserRelations: IncludedUserRelations = {
            address: true
        }

        const user = await this.userRepository.create(createPayload, includedUserRelations);

        //Ця ассерція скоріш за все не потрібна, бо маппер буде валідувати значення user
        //assertHasAccessOrThrow(user)

        return user;
    }

    //сервісний метод для отримання поточного автентифікованого користувача з реляціями
    async fetchAuthUser(id: number): Promise<UserFull> {
        const includedUserRelations: IncludedUserRelations = {
            address: true
        }

        const user = await this.userRepository.findFullByIdOrThrow(id, includedUserRelations);

        return user;
    }


    //Сервісний метод для отримання користувача без реляцій. Використовується в адмінці
    async fetchUserById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findByIdOrThrow(id);

        return user;
    }


    //Сервісний метод, який викликається модулем types під час автентифікації користувача
    async fetchUserForAuthByEmail(email: string): Promise<UserAuth | null> {
        const user = await this.userRepository.findForAuthByEmail(email);

        return user;
    }

    //Сервісний метод для отримання списку користувачів без реляцій. Використовується в адмінці
    async getUsersList(getUsersListOptions: GetUsersListOptions): Promise<GetUsersListResult> {
        const {pageNo, pageSize} = getUsersListOptions;

        const findManyOptions = toFindManyOptions(getUsersListOptions);

        const {content, roles, totalElements} = await this.userRepository.findMany(findManyOptions);

        const paginationResult = createPaginationResult(pageNo, pageSize, totalElements);

        const getUsersListResult: GetUsersListResult = {
            content,
            roles,
            ...paginationResult
        }

        return getUsersListResult;
    }

    async verifyCredentials(email: string, password: string): Promise<AuthenticatedUser | null> {
        const user = await this.userRepository.findForAuthByEmail(email);
        if(!user) {
            return null;
        }

        const isPasswordValid = await this.hashProvider.compare(password, user.password);
        if(!isPasswordValid) {
            return null;
        }

        const authenticatedUser: AuthenticatedUser = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        return authenticatedUser;
    }
}
