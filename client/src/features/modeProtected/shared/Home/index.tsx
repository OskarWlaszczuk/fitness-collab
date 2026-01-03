import { useUserActiveRoleQuery } from "../../../../common/hooks/useUserActiveRoleQuery.ts";
import { useUserProfileQuery } from "../../../../common/hooks/useUserProfileQuery.ts";

export const Home = () => {
    const { activeRole } = useUserActiveRoleQuery();
    const userProfileQuery = useUserProfileQuery();

    return (
        <div style={{ color: "black" }}>
            hello {activeRole?.name} {userProfileQuery.data?.user.name}
        </div>
    );
};