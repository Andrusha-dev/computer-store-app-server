import type {UserEntity} from "../../models/custom/user.model.ts";

export interface LoginResult {
    user: UserEntity; //поле user тут як корисне навантаження. Для маппінгу до LoginResponse воно не потрібне
    accessToken: string;
    refreshToken: string;
}

export interface RefreshAllTokensResult {
    accessToken: string;
    refreshToken: string;
}