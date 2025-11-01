import { useMutation } from "@tanstack/react-query";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { authApi } from "../../apiClients";

const logoutUser = async () => {
    try {
        await authApi.delete("/logout");
    } catch (error) {
        console.error("Login request error:", error);
        throw error;
    }
};

const onLogoutSuccess = (navigate: NavigateFunction) => {
    navigate("/home", { replace: true });
};

const onLoginError = (error: unknown) => {
    console.error("Login error:", error);
};

export const useLogoutUserMutation = () => {
    const navigate = useNavigate();

    const { mutate: logout, isPending, isSuccess, error, isError } = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => onLogoutSuccess(navigate),
        onError: (error) => onLoginError(error)
    });

    return {
        logout,
        isPending,
        isSuccess,
        error,
        isError
    };
};