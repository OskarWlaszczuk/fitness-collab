import { useState } from "react";
import { SubmitButton, ErrorText, FormWrapper, Input, SuccessText, Form, ModeButton } from "../Register/styled";
import { Link } from "react-router-dom";
import type { LoginData } from "../../../common/types/LoginData";
import { useLoginUserMutation } from "../../../common/hooks/useLoginUserMutation";
import { useGetUserModes } from "../../../common/hooks/useGetUserModes";


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
    } = useLoginUserMutation();

    const { modes } = useGetUserModes();
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        loginUser(form);
    };

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