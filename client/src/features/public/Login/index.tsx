import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitButton, ErrorText, FormWrapper, Input, SuccessText, Form, ModeButton } from "../Register/styled";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import axios from "axios";

export interface UserMode {
    id: number;
    name: string;
}

interface ModesResponse {
    modes: UserMode[];
}

interface LoginData {
    email: string;
    password: string;
    modeId: UserMode["id"] | undefined;
}

const loginUser = async (data: LoginData) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", data, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        console.error("Login request error:", error);
        throw error;
    }
};

const onLoginSuccess = (navigate: NavigateFunction) => {
    navigate("/home", {replace: true});
};

const onLoginError = (error: unknown) => {
    console.error("Login error:", error);
};

const useLoginUser = () => {
    const navigate = useNavigate();

    const { mutate, isPending, isSuccess, error, isError } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => onLoginSuccess(navigate),
        onError: (error) => onLoginError(error)
    });

    return {
        mutate,
        isPending,
        isSuccess,
        error,
        isError
    };
};

const fetchModes = async () => {
    const response = await axios.get<ModesResponse>("http://localhost:5000/api/modes");
    return response.data.modes;
}

const useGetModes = () => {
    const {
        status: modesStatus,
        data: modes,
        isPaused: isModesPaused
    } = useQuery<UserMode[]>({
        queryKey: ["modes"],
        queryFn: fetchModes,
    });

    return { modesStatus, isModesPaused, modes };
};

export const Login = () => {
    const [form, setForm] = useState<LoginData>({
        email: "",
        password: "",
        modeId: undefined
    });

    const {
        mutate: loginUser,
        isPending: isLoginPending,
        isSuccess: isLoginSuccess,
        error: loginError,
        isError: isLoginError,
    } = useLoginUser();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        loginUser(form);
    };

    const { modes } = useGetModes();

    return (
        <FormWrapper>
            <Form onSubmit={handleFormSubmit} id="loginForm">
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                />

                <p>Don't have an account? <Link to="/register">Register here</Link></p>

                {(isLoginError && loginError) && (
                    <ErrorText>Nie udało się zalogować. Sprawdź dane.</ErrorText>
                )}
                {isLoginSuccess && (
                    <SuccessText>Logowanie zakończone sukcesem!</SuccessText>
                )}
            </Form>

            <div>
                {modes?.map(({ name, id }) => (
                    <ModeButton
                        $active={form.modeId === id}
                        onClick={() => setForm(form => ({ ...form, modeId: id }))}
                        key={name}
                    >
                        {name}
                    </ModeButton>
                ))}
            </div>

            <SubmitButton type="submit" disabled={isLoginPending || !form.modeId} form="loginForm">
                {isLoginPending ? "Logowanie..." : "Zaloguj"}
            </SubmitButton>
        </FormWrapper>
    );
};
