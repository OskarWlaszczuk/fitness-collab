import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../apiClients";
import { useAccessTokenQuery } from "./useAccessTokenQuery";
import type { UserMode } from "../types/UserMode";

interface UserActiveModeResponse {
    mode: UserMode;
}

export const useUserActiveModeQuery = () => {
    //wywoływać useAccessTokenQuery tu czy poza hookiem i przekazywać at w param?
    const { accessToken } = useAccessTokenQuery();

    const refreshTimeMin = 15 * 60 * 1000;
    //jak obsługiwać błędu queryFn?
    const fetchUserActiveMode = async (): Promise<UserActiveModeResponse> => {
        const response = await userApi.get("/user/activeMode");
        return response.data;
    };

    const { data: activeMode, status, isPaused, error } = useQuery<UserActiveModeResponse>({
        queryKey: ["activeMode"],
        queryFn: fetchUserActiveMode,
        staleTime: refreshTimeMin,
        gcTime: refreshTimeMin,
        refetchInterval: refreshTimeMin,
        retry: 1,
        enabled: !!accessToken,
    });

    return {
        status,
        activeMode,
        isPaused,
        error,
    };
};