import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../apiClients";
import { useAccessTokenQuery } from "./useAccessTokenQuery";
import type { UserRole } from "../types/UserRole";

interface UserActiveRoleResponse {
    role: UserRole;
}

export const useUserActiveRoleQuery = () => {
    //wywoływać useAccessTokenQuery tu czy poza hookiem i przekazywać at w param?
    const { accessToken } = useAccessTokenQuery();

    const refreshTimeMin = 15 * 60 * 1000;
    //jak obsługiwać błędu queryFn?
    const fetchUserActiveRole = async (): Promise<UserRole> => {
        const response = await userApi.get<UserActiveRoleResponse>("/activeRole");
        return response.data.role;
    };

    const { data: activeRole, status, isPaused, error } = useQuery({
        queryKey: ["user","activeRole"],
        queryFn: fetchUserActiveRole,
        staleTime: refreshTimeMin,
        gcTime: refreshTimeMin,
        refetchInterval: refreshTimeMin,
        retry: 1,
        enabled: !!accessToken,
    });

    return {
        status,
        activeRole,
        isPaused,
        error,
    };
};