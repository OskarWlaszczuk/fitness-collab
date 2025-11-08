import { StyledTopPanel } from "./styled"
import { useUserActiveRoleQuery } from "../../../../common/hooks/useUserActiveRoleQuery";
import { useLogoutUserMutation } from "../../../../common/hooks/useLogoutUserMutation";

export const TopPanel = () => {
    const { logout } = useLogoutUserMutation();
    const { activeRole } = useUserActiveRoleQuery();

    return (
        <StyledTopPanel>
            <button onClick={()=> logout()}>logout {activeRole?.name}</button>
        </StyledTopPanel>
    );
};