import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitButton, ErrorText, FormWrapper, Input, SuccessText, Form, ModeButton } from "./styled";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import axios from "axios";

interface Mode {
  id: number;
  name: string;
}

interface RegisterData {
  email: string;
  name: string;
  surname: string;
  nickname: string;
  password: string;
  modeId: Mode["id"] | undefined;
}

const registerUser = async (data: RegisterData) => {
  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", data, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

const onRegisterSuccess = (navigate: NavigateFunction) => {
  navigate("/fitness-collab/home")
};

const onRegisterError = (error: unknown) => {
  console.error("Registration error:", error);
};

const useRegisterUser = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => onRegisterSuccess(navigate),
    onError: (error) => onRegisterError(error)
  });

  return {
    mutate,
    isPending,
    isSuccess,
    error,
    isError
  };
};

interface Mode {
  id: number;
  name: string;
}

interface ModesResponse {
  modes: Mode[];
}

const fetchModes = async () => {
  const response = await axios.get<ModesResponse>("http://localhost:5000/api/modes");
  return response.data.modes;
}

const useGetModes = () => {
  const {
    status: modesStatus,
    data: modes,
    isPaused: isModesPaused
  } = useQuery<Mode[]>({
    queryKey: ["modes"],
    queryFn: fetchModes,
  });

  return { modesStatus, isModesPaused, modes };
};

export const Register = () => {
  const [form, setForm] = useState<RegisterData>({
    email: "",
    name: "",
    surname: "",
    nickname: "",
    password: "",
    modeId: undefined,
  });

  const {
    mutate: registerUser,
    isPending: isRegisterUserPending,
    isSuccess: isRegisterUserSuccess,
    error: registerUserError,
    isError: isRegisterUserError,
  } = useRegisterUser();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    registerUser(form);
  };

  const { modes } = useGetModes();
  console.log(form);

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



        <p>Login <Link to="/fitness-collab/auth/login">here</Link></p>
        {(isRegisterUserError && registerUserError) && (
          <ErrorText>{registerUserError.message}</ErrorText>
        )}
        {isRegisterUserSuccess && (
          <SuccessText>Registration successful!</SuccessText>
        )}
      </Form>
      <div>
        {
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