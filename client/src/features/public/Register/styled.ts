import styled from "styled-components";

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.white};
    border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 50%;
  margin: auto;
`;

export const Form = styled.form`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.black || "#3498db"};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

interface ModeButtonProps {
  $active?: boolean;
}

export const ModeButton = styled.button<ModeButtonProps>`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ $active, theme }) => ($active ? theme.colors.scienceBlue : theme.colors.pattensBlue)};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.black)};
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
filter: brightness(102%);
}
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.black || "#3498db"};
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.pattensBlue || "#2980b9"};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
`;

export const SuccessText = styled.p`
  color: green;
  font-size: 0.9rem;
  text-align: center;
`;