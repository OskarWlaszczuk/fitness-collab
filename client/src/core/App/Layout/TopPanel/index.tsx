import { NavLink, useNavigate } from "react-router-dom"
import { StyledTopPanel } from "./styled"
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessTokenQuery } from "../../../../common/hooks/useAccessTokenQuery";


export const TopPanel = () => {
    const { accessToken } = useAccessTokenQuery();

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = async () => {
        //użyć useMutation
        try {
            await axios.delete("http://localhost:5000/api/auth/logout", { withCredentials: true });
            //czyszczenie cacha i przenoszenie do login wewnątrz funkcji onSuccess
            queryClient.setQueryData(["accessToken"], null);
            queryClient.removeQueries({ queryKey: ["accessToken"] });
            navigate("/fitness-collab/auth/login");

        } catch (error) {
            console.log(error);
        }
    };

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
            <button onClick={logout}>logout</button>
        </StyledTopPanel>
    );
};