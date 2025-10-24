import { NavItem, NavItemIcon, NavItemLabel, StyledNavPanel } from "./styled"

export const NavPanel = () => {
    const navItemsConfig = [
        {
            icon: "",
            label: "Home",
            routePath: "home/"
        },
    ];

    return (
        <StyledNavPanel>
            {
                navItemsConfig.map(({ icon, label, routePath }) => (
                    <NavItem to={routePath} key={label}>
                        <NavItemIcon>{icon}</NavItemIcon>
                        <NavItemLabel>{label}</NavItemLabel>
                    </NavItem>
                ))
            }
        </StyledNavPanel>
    );
};