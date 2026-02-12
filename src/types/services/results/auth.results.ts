import type {User, UserWithRelations} from "../../models/generated";

export type LoginResult = {
    user: User; //поле user тут як корисне навантаження. Для маппінгу до LoginResponse воно не потрібне
    accessToken: string;
    refreshToken: string;
}

export type RefreshAllTokensResult = {
    accessToken: string;
    refreshToken: string;
}