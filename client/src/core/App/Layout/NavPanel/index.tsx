import { useUserActiveModeQuery } from "../../../../common/hooks/useUserActiveModeQuery";
import { NavItem, NavItemIcon, NavItemLabel, StyledNavPanel } from "./styled"

export const NavPanel = () => {
    const { activeMode, status } = useUserActiveModeQuery();


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
        {
            icon: "",
            label: "Profile",
            routePath: "/profile"
        },
    ];

    const traineeNavConfig = [
        ...sharedNavConfig,
        {
            icon: "",
            label: "workouts",
            routePath: "/workouts"
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

    const navConfig = activeMode?.mode.id === 1 ? traineeNavConfig : trainerNavConfig;


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