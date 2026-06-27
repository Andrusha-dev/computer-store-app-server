import type {AuthResponse, LoginDto, RefreshAllTokensDto} from "../api/auth.dto";


//Повний контракт сервісу для використання в Controller
export interface IAuthService {
    login: (dto: LoginDto) => Promise<AuthResponse>;
    refreshAllTokens: (dto: RefreshAllTokensDto) => AuthResponse;
}



