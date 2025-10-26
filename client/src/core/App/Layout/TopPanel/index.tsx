import { NavLink } from "react-router-dom"
import { StyledTopPanel } from "./styled"


export const TopPanel = () => {

    return (
        <StyledTopPanel>
            <NavLink to="/fitness-collab/auth/login">Login</NavLink>
            <NavLink to="/fitness-collab/auth/register">Register</NavLink>
        </StyledTopPanel>
    );
};