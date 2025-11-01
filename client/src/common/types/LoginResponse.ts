import type { AccessToken } from "./AccessToken";
import type { UserMode } from "./UserMode";

export interface LoginResponse {
    accessToken: AccessToken,
    mode: UserMode
    user: {
        id: number;
        name: string;
        surname: string;
        email: string;
        nickname: string;
        createdAt: string;
    }
};