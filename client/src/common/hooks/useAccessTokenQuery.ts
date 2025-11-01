import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../apiClients";
import type { AccessToken } from "../types/AccessToken";

export interface AccessTokenResponse {
    accessToken: AccessToken;
}

export const useAccessTokenQuery = () => {
    const refreshTimeMin = 15 * 60 * 1000;
    //jak obsługiwać błędu queryFn?
    const refreshAccessToken = async (): Promise<AccessToken> => {
        const response = await authApi.get<AccessTokenResponse>("/refreshAccessToken");
        return response.data.accessToken;
    };

    const { data: accessToken, status, isPaused, error, refetch: refetchAccessToken } = useQuery({
        queryKey: ["accessToken"],
        queryFn: refreshAccessToken,
        staleTime: refreshTimeMin,
        gcTime: refreshTimeMin,
        refetchInterval: refreshTimeMin,
        retry: 1,
    });

    return {
        status,
        accessToken,
        isPaused,
        error,
        refetchAccessToken
    };
};