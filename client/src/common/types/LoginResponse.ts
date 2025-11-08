import type { AccessToken } from "./AccessToken";
import type { UserRole } from "./UserRole";

export interface LoginResponse {
    accessToken: AccessToken,
    role: UserRole
    user: {
        id: number;
        name: string;
        surname: string;
        email: string;
        nickname: string;
        createdAt: string;
    }
};