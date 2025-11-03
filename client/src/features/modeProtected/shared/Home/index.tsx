import { useQuery } from "@tanstack/react-query";
import { useAccessTokenQuery } from "../../../../common/hooks/useAccessTokenQuery";
import { useUserActiveModeQuery } from "../../../../common/hooks/useUserActiveModeQuery";
import { userApi } from "../../../../apiClients";

export const Home = () => {
    const { accessToken } = useAccessTokenQuery();
    const { activeMode } = useUserActiveModeQuery();

    const getUser = async () => {
        try {
            const response = await userApi.get("/profile");
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const userFreshTimeMin = 60 * 60 * 1000;

    const { data: userProfile } = useQuery({
        queryKey: ["user", "profile"],
        queryFn: getUser,
        staleTime: userFreshTimeMin,
        gcTime: userFreshTimeMin,
        enabled: !!accessToken,
        refetchOnWindowFocus: false,
    });


    return (
        <div style={{ color: "black" }}>
            hello {activeMode?.name} {userProfile?.user.name}
        </div>
    );
};