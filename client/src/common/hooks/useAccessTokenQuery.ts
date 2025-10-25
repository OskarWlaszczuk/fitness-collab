import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAccessTokenQuery = () => {
    const refreshTimeMin = 15 * 60 * 1000;

    const refreshAccessToken = async (): Promise<string> => {
        const response = await axios.get("http://localhost:5000/api/auth/refreshAccessToken");
        return response.data.data.accessToken;
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