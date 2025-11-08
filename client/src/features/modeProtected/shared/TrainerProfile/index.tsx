import { useParams } from "react-router-dom";
import { useUserActiveRoleQuery } from "../../../../common/hooks/useUserActiveRoleQuery";

export const TrainerProfile = () => {
    const { activeRole } = useUserActiveRoleQuery();
    const { id } = useParams();

    return (
        <>
            <h1>Trainer {id} Profile</h1>
            <section>
                <header>Description</header>
                {
                    activeRole?.name === "trainer" && (
                        <div>
                            <button>Edit</button>
                        </div>
                    )
                }
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur impedit quia cupiditate iste distinctio quod nulla, libero ea tenetur quisquam. Molestiae laudantium enim, labore atque autem id ratione ad temporibus?
                </p>
            </section>
        </>
    );
};