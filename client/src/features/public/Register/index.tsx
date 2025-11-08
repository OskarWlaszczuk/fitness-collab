import { useState } from "react";
import { SubmitButton, ErrorText, FormWrapper, Input, SuccessText, Form, RoleButton } from "./styled";
import { Link } from "react-router-dom";
import { useUserRolesQuery } from "../../../common/hooks/useUserRolesQuery";
import { useRegisterUserMutation } from "../../../common/hooks/useRegisterUserMutation";
import type { RegisterData } from "../../../common/types/RegisterData";

export const Register = () => {
  const [form, setForm] = useState<RegisterData>({
    email: "",
    name: "",
    surname: "",
    nickname: "",
    password: "",
    roleId: 1,
  });

  const {
    mutate: registerUser,
    isPending: isRegisterUserPending,
    isSuccess: isRegisterUserSuccess,
    error: registerUserError,
    isError: isRegisterUserError,
  } = useRegisterUserMutation();
  console.log(registerUserError?.response.data.message);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    registerUser(form);
  };

  const { roles } = useUserRolesQuery();

  return (
    <FormWrapper>
      <Form onSubmit={handleFormSubmit} id="registrationForm">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="surname"
          placeholder="Surname"
          value={form.surname}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="nickname"
          placeholder="Nickname"
          value={form.nickname}
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
        <p>Login <Link to="/login">here</Link></p>
        {(isRegisterUserError && registerUserError) && (
          <ErrorText>{registerUserError?.response.data.message}</ErrorText>
        )}
        {isRegisterUserSuccess && (
          <SuccessText>Registration successful!</SuccessText>
        )}
      </Form>
      <div>
        {
          //wynieść do oddzielnego komponentu 
          roles?.map(({ name, id }) => (
            <RoleButton
              $active={form.roleId === id}
              onClick={() => setForm(form => ({ ...form, roleId: id }))}
              key={name}
            >
              {name}
            </RoleButton>
          ))
        }
      </div>
      <SubmitButton type="submit" disabled={isRegisterUserPending || !form.roleId} form="registrationForm">
        {isRegisterUserPending ? "Registering..." : "Register"}
      </SubmitButton>
    </FormWrapper>
  );
};