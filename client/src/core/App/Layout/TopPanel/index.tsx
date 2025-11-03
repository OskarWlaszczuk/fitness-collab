import { StyledTopPanel } from "./styled"
import { useUserActiveModeQuery } from "../../../../common/hooks/useUserActiveModeQuery";
import { useLogoutUserMutation } from "../../../../common/hooks/useLogoutUserMutation";

export const TopPanel = () => {
    const { logout } = useLogoutUserMutation();
    const { activeMode } = useUserActiveModeQuery();

    return (
        <StyledTopPanel>
            <button onClick={()=> logout()}>logout {activeMode?.name}</button>
        </StyledTopPanel>
    );
};