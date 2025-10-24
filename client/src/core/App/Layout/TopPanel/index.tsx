import { NavLink } from "react-router-dom"
import { StyledTopPanel } from "./styled"


export const TopPanel = () => {

    return (
        <StyledTopPanel>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
        </StyledTopPanel>
    );
};