import { NavLink, useNavigate } from "react-router-dom"
import { StyledTopPanel } from "./styled"
import { useQueryClient } from "@tanstack/react-query";
import { useAccessTokenQuery } from "../../../../common/hooks/useAccessTokenQuery";
import { authApi } from "../../../../apiClients";


export const TopPanel = () => {
    const { accessToken } = useAccessTokenQuery();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = async () => {
        //użyć useMutation
        try {
            await authApi.delete("/logout");
            //czyszczenie cacha i przenoszenie do login wewnątrz funkcji onSuccess
            const accessTokenCache = queryClient.getQueryData(['accessToken']);
            const profileCache = queryClient.getQueryData(['user']);
            console.log("Cache po wylogowaniu, przed usunięciem:", accessTokenCache, profileCache);

            queryClient.setQueryData(["accessToken"], null);
            queryClient.setQueryData(["user", "profile"], null);

            queryClient.removeQueries({ queryKey: ["accessToken"] });
            queryClient.removeQueries({ queryKey: ["user"] });


            console.log("Cache po wylogowaniu:", accessTokenCache, profileCache);

            // navigate("/fitness-collab/auth/login");

        } catch (error) {
            console.log(error);
        }
    };
    const accessTokenCache = queryClient.getQueryData(['accessToken']);
    const profileCache = queryClient.getQueryData(['user']);
    console.log(accessTokenCache, profileCache);

    return (
        <StyledTopPanel>
            {
                !accessToken && (
                    <>
                        <NavLink to="/fitness-collab/auth/login">Login</NavLink>
                        <NavLink to="/fitness-collab/auth/register">Register</NavLink>
                    </>
                )
            }
            {
                accessToken && (
                    <button onClick={logout}>logout</button>
                )
            }
        </StyledTopPanel>
    );
};