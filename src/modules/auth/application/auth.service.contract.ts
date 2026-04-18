import type {LoginDto, RefreshAllTokensDto} from "../api/auth.dto.ts";
import type {AuthTokens} from "../domain/auth.types.ts";


//Повний контракт сервісу для використання в Controller
export interface IAuthService {
    login: (loginDto: LoginDto) => Promise<AuthTokens>;
    refreshAllTokens: (refreshAllTokensDto: RefreshAllTokensDto) => AuthTokens;
}



