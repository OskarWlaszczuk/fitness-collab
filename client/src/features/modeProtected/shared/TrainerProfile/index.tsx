import { useParams } from "react-router-dom";
import { useUserActiveModeQuery } from "../../../../common/hooks/useUserActiveModeQuery";

export const TrainerProfile = () => {
    const { activeMode } = useUserActiveModeQuery();
    const { id } = useParams();

    return (
        <>
            <h1>Trainer {id} Profile</h1>
            <section>
                <header>Description</header>
                {
                    activeMode?.name === "trainer" && (
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