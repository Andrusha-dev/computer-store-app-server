import type {AuthResponse, LoginDto, RefreshAllTokensDto} from "../api/auth.dto.ts";


//Повний контракт сервісу для використання в Controller
export interface IAuthService {
    login: (dto: LoginDto) => Promise<AuthResponse>;
    refreshAllTokens: (dto: RefreshAllTokensDto) => AuthResponse;
}



