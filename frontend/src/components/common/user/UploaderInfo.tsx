import { User2 } from "lucide-react";

import { UserSummary } from "@/types/api";
import UserAvatar from "./UserAvatar";

interface UploaderInfoProps {
    user?: UserSummary;
    subtitle?: string;
}

const UploaderInfo = ({ user, subtitle }: UploaderInfoProps) => {
    if (!user || !user.id) {
        return (
            <div className="text-xs text-foreground-tertiary flex items-center gap-1 group">
                <User2
                    className="inline size-9 rounded-full border p-1.5 group-hover:border-2 group-hover:border-foreground-muted transition-all duration-100"
                />
                <div className="flex flex-col">
                    <span className="text-foreground group-hover:underline">Unknown User</span>
                    <span>{subtitle}</span>
                </div>
            </div>
        )
    }

    return (
        <UserAvatar
            userId={user.id}
            fullName={user.fullName}
            avatarUrl={user.profile?.profilePictureUrl}
            subtitle={subtitle}
        />
    )
}

export default UploaderInfo;