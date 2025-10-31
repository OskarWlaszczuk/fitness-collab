import { useNavigate } from "react-router-dom"
import { StyledTopPanel } from "./styled"
import { useQueryClient } from "@tanstack/react-query";
import { authApi } from "../../../../apiClients";
import { useUserActiveModeQuery } from "../../../../common/hooks/useUserActiveModeQuery";


export const TopPanel = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { activeMode } = useUserActiveModeQuery();

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

            navigate("/login", { replace: true });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <StyledTopPanel>
            <button onClick={logout}>logout {activeMode?.mode.name}</button>
        </StyledTopPanel>
    );
};