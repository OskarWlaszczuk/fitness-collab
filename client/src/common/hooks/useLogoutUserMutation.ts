import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../apiClients";

const logoutUser = async () => {
    await authApi.delete("/logout");
};

export const useLogoutUserMutation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: logout, isPending, isSuccess, error, isError } = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            //czy powinienem wszystkie dane użytkownika usunąć z cache?
            queryClient.setQueryData(["accessToken"], null);
            queryClient.setQueryData(["user", "profile"], null);
            queryClient.setQueryData(["user", "activeMode"], null);

            navigate("/login", { replace: true });
        },
    });

    return {
        logout,
        isPending,
        isSuccess,
        error,
        isError
    };
};