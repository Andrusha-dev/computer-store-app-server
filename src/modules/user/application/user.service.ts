import type {IUserService} from "./user.service.contract.ts";
import {
    type UserEntity,
    type UserFull,
} from "../domain/user.entity.ts";
import {toFindManyOptions, toUserCreateInput} from "./user.mapper.ts";
import type {IUserRepository} from "../domain/user.repository.contract.ts";
import type {IHashProvider} from "../../../shared/contracts/hash.contract.ts";
import type {CreateUserDto, GetUsersListQuery} from "../api/user.dto.ts";
import type {FindManyResult} from "../../../shared/types/repository.types.ts";







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

    createUser = async (createUserDto: CreateUserDto): Promise<UserFull> => {
        //Хешуємо пароль
        const passwordHash = await this.hashProvider.hash(createUserDto.password);

        const userCreateInput = toUserCreateInput({
            ...createUserDto,
            password: passwordHash,
        });


        const user: UserFull = await this.userRepository.create(userCreateInput);

        return user;
    }

    //сервісний метод для отримання поточного автентифікованого користувача з реляціями
    fetchAuthUser = async (id: number): Promise<UserFull> => {
        const user: UserFull = await this.userRepository.findFullByIdOrThrow(id);

        return user;
    }


    //Сервісний метод для отримання користувача без реляцій. Використовується в адмінці
    fetchUserById = async (id: number): Promise<UserEntity> => {
        const user = await this.userRepository.findByIdOrThrow(id);

        return user;
    }


    //Сервісний метод, який викликається модулем schemas під час автентифікації користувача
    fetchUserByEmail = async (email: string): Promise<UserEntity | null> => {
        const user: UserEntity | null = await this.userRepository.findByEmail(email);

        if (!user) {
            return null;
        }

        return user;
    }


    //Сервісний метод для отримання списку користувачів без реляцій. Використовується в адмінці
    getUsersList =
        async (getUsersListQuery: GetUsersListQuery): Promise<FindManyResult<UserEntity>> => {
            const findManyOptions = toFindManyOptions(getUsersListQuery);

            const findManyResult = await this.userRepository.findMany(findManyOptions);

            return findManyResult;
        }


    //Сервісний метод для пошуку та валідації користувача по email та password,
    //отриманих від AuthService, для перевірки автентифікації
    verifyCredentials =
        async (email: string, password: string): Promise<UserEntity | null> => {
            const user: UserEntity | null = await this.fetchUserByEmail(email);
            if(!user) {
                return null;
            }

            const isPasswordValid = await this.hashProvider.compare(password, user.password);
            if(!isPasswordValid) {
                return null;
            }



            return user;
        }
}