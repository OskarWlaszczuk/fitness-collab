import { useState } from "react";
import { SubmitButton, ErrorText, FormWrapper, Input, SuccessText, Form, ModeButton } from "./styled";
import { Link } from "react-router-dom";
import { useGetUserModes } from "../../../common/hooks/useGetUserModes";
import { useRegisterUserMutation } from "../../../common/hooks/useRegisterUserMutation";
import type { RegisterData } from "../../../common/types/RegisterData";

export const Register = () => {
  const [form, setForm] = useState<RegisterData>({
    email: "",
    name: "",
    surname: "",
    nickname: "",
    password: "",
    modeId: 1,
  });

  const {
    mutate: registerUser,
    isPending: isRegisterUserPending,
    isSuccess: isRegisterUserSuccess,
    error: registerUserError,
    isError: isRegisterUserError,
  } = useRegisterUserMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    registerUser(form);
  };

  const { modes } = useGetUserModes();

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
          <ErrorText>{registerUserError.message}</ErrorText>
        )}
        {isRegisterUserSuccess && (
          <SuccessText>Registration successful!</SuccessText>
        )}
      </Form>
      <div>
        {
          //wynieść do oddzielnego komponentu 
          modes?.map(({ name, id }) => (
            <ModeButton
              $active={form.modeId === id}
              onClick={() => setForm(form => ({ ...form, modeId: id }))}
              key={name}
            >
              {name}
            </ModeButton>
          ))
        }
      </div>
      <SubmitButton type="submit" disabled={isRegisterUserPending || !form.modeId} form="registrationForm">
        {isRegisterUserPending ? "Registering..." : "Register"}
      </SubmitButton>
    </FormWrapper>
  );
};