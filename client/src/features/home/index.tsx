import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../apiClients";
import { useAccessTokenQuery } from "../../common/hooks/useAccessTokenQuery";

export const Home = () => {
    const { accessToken } = useAccessTokenQuery();

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

    console.log(userProfile);

    return (
        <div style={{ color: "black" }}>
            {
                accessToken ?
                    <p>Welcome {userProfile?.user.nickname}</p> :
                    <h1>Home page</h1>
            }
        </div>
    );
};