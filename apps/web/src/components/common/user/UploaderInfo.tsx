import Link from "next/link";
import { User2 } from "lucide-react";

import { UploaderSummary } from "@/types/api";
import UserAvatar from "./UserAvatar";

interface UploaderInfoProps {
    user?: UploaderSummary;
    subtitle?: string;
}

const UploaderInfo = ({ user, subtitle }: UploaderInfoProps) => {
    if (!user || !user?.id) {
        return (
            <div className="text-xs text-foreground-tertiary flex items-center gap-1 group/uploader">
                <User2
                    className="inline size-9 rounded-full border p-1.5 group-hover/uploader:border-2 group-hover/uploader:border-foreground-muted transition-all duration-100"
                />
                <div className="flex flex-col">
                    <span className="text-foreground group-hover/uploader:underline">Unknown User</span>
                    <span>{subtitle}</span>
                </div>
            </div>
        )
    }

    return (
        // Named group (group/uploader) so this link's own hover is what triggers the
        // underline below - a plain unnamed `group` would also react to an unrelated
        // ancestor `group` (e.g. a card this is nested in) being hovered instead.
        <Link
            href={`/users/${user.id}`}
            className="text-xs text-foreground-tertiary flex items-center gap-1 group/uploader"
        >
            <UserAvatar
                fullName={user.fullName}
                avatarUrl={user.profile?.profilePictureUrl}
                size={"sm"}
            />
            <div className="flex flex-col">
                <span className="text-foreground group-hover/uploader:underline">{user.fullName}</span>
                <span>{subtitle}</span>
            </div>
        </Link>
    )
}

export default UploaderInfo;