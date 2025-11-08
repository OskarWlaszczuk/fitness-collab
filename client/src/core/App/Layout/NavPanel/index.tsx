import { useUserActiveRoleQuery } from "../../../../common/hooks/useUserActiveRoleQuery";
import { NavItem, NavItemIcon, NavItemLabel, StyledNavPanel } from "./styled"

export const NavPanel = () => {
    const { activeRole } = useUserActiveRoleQuery();


    const sharedNavConfig = [
        {
            icon: "",
            label: "Home",
            routePath: "/home"
        },
        {
            icon: "",
            label: "Chats",
            routePath: "/chats"
        },
    ];

    const traineeNavConfig = [
        ...sharedNavConfig,
        {
            icon: "",
            label: "workout plans",
            routePath: "/workout-plans"
        },
    ]

    const trainerNavConfig = [
        ...sharedNavConfig,
        {
            icon: "",
            label: "workout creator",
            routePath: "/workout-creator"
        },
    ]

    const navConfig = activeRole?.id === 1 ? traineeNavConfig : trainerNavConfig;


    return (
        <StyledNavPanel>
            {
                navConfig.map(({ icon, label, routePath }) => (
                    <NavItem to={routePath} key={label}>
                        <NavItemIcon>{icon}</NavItemIcon>
                        <NavItemLabel>{label}</NavItemLabel>
                    </NavItem>
                ))
            }
        </StyledNavPanel>
    );
};