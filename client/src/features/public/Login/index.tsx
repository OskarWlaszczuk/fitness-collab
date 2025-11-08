import { useState } from "react";
import { SubmitButton, ErrorText, FormWrapper, Input, SuccessText, Form, RoleButton } from "../Register/styled";
import { Link } from "react-router-dom";
import type { LoginData } from "../../../common/types/LoginData";
import { useLoginUserMutation } from "../../../common/hooks/useLoginUserMutation";
import { useUserRolesQuery } from "../../../common/hooks/useUserRolesQuery";

export const Login = () => {
    const [form, setForm] = useState<LoginData>({
        email: "",
        password: "",
        roleId: 1
    });

    const {
        mutate: loginUser,
        isPending: isLoginPending,
        isSuccess: isLoginSuccess,
        error: loginError,
        isError: isLoginError,
    } = useLoginUserMutation();

    console.log(loginError?.response.data.message);


    const { roles } = useUserRolesQuery();
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
                    <ErrorText>{loginError?.response.data.message}</ErrorText>
                )}
                {isLoginSuccess && (
                    <SuccessText>Logowanie zakończone sukcesem!</SuccessText>
                )}
            </Form>

            <div>
                {roles?.map(({ name, id }) => (
                    <RoleButton
                        $active={form.roleId === id}
                        onClick={() => setForm(form => ({ ...form, roleId: id }))}
                        key={name}
                    >
                        {name}
                    </RoleButton>
                ))}
            </div>

            <SubmitButton type="submit" disabled={isLoginPending || !form.roleId} form="loginForm">
                {isLoginPending ? "Logowanie..." : "Zaloguj"}
            </SubmitButton>
        </FormWrapper>
    );
};