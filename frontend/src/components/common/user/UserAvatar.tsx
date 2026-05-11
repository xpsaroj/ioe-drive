import Image from "next/image";
import Link from "next/link";
import { User2 } from "lucide-react";

interface UserAvatarProps {
    userId: number;
    fullName: string;
    avatarUrl?: string;
    subtitle?: string;
}

const UserAvatar = ({ userId, fullName, avatarUrl, subtitle }: UserAvatarProps) => {
    return (
        <Link
            href={`/users/${userId}`}
            className="text-xs text-foreground-tertiary flex items-center gap-1 group"
        >
            {avatarUrl
                ? (
                    <Image
                        src={avatarUrl}
                        alt={fullName}
                        width={36}
                        height={36}
                        className="inline size-9 rounded-full border  group-hover:border-2 group-hover:border-foreground-muted transition-all duration-100"
                    />
                ) : (
                    <User2
                        className="inline size-9 rounded-full border p-1.5 group-hover:border-2 group-hover:border-foreground-muted transition-all duration-100"
                    />
                )}
            <div className="flex flex-col">
                <span className="text-foreground group-hover:underline">{fullName}</span>
                <span>{subtitle}</span>
            </div>
        </Link>
    )
}

export default UserAvatar;