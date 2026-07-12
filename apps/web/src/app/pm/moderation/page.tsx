import { redirect } from "next/navigation";

const ModerationPage = () => {
    redirect("/pm/moderation/pending");
};

export default ModerationPage;
