import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../apiClients";

export const useAccessTokenQuery = () => {
    const refreshTimeMin = 15 * 60 * 1000;
    //jak obsługiwać błędu queryFn?
    const refreshAccessToken = async (): Promise<string> => {
        const response = await authApi.get("/refreshAccessToken");
        return response.data.accessToken;
    };

    const { data: accessToken, status, isPaused, error, refetch: refetchAccessToken } = useQuery<string>({
        queryKey: ["accessToken"],
        queryFn: refreshAccessToken,
        staleTime: refreshTimeMin,
        cacheTime: refreshTimeMin,
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