import { useQuery } from "@tanstack/react-query";
import { api } from "../../apiClients";
import { useAccessTokenQuery } from "./useAccessTokenQuery";

export const useUserProfileQuery = () => {
    const { accessToken } = useAccessTokenQuery();

    const getUser = async () => {
        try {
            const response = await api.get("/user/profile");
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const userFreshTimeMin = 60 * 60 * 1000;

    const userProfileQuery = useQuery({
        queryKey: ["user", "profile"],
        queryFn: getUser,
        staleTime: userFreshTimeMin,
        gcTime: userFreshTimeMin,
        enabled: !!accessToken,
        refetchOnWindowFocus: false,
    });

    return userProfileQuery;
};