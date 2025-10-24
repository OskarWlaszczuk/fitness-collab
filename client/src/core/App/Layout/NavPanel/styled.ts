import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const StyledNavPanel = styled.nav`
    display: grid;
    grid-template-columns: 1fr;
    background-color: ${({ theme }) => theme.colors.black};
    grid-area: nav;
    border-radius: 8px;
`;

export const NavItem = styled(NavLink)`
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
`;

export const NavItemIcon = styled.div`

`;

export const NavItemLabel = styled.span`

`;