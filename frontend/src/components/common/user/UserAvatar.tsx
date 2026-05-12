import Image from "next/image";
import { User2 } from "lucide-react";

import { cn } from "@/utils/cn";

interface UserAvatarProps {
    fullName: string;
    avatarUrl?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const avatarSizes = {
    sm: "size-8",
    md: "size-10",
    lg: "size-24",
    xl: "size-32",
};

const imageSizes = {
    sm: 32,
    md: 40,
    lg: 96,
    xl: 128,
};

const iconPadding = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-4",
    xl: "p-5",
};

const UserAvatar = ({
    fullName,
    avatarUrl,
    size = "md"
}: UserAvatarProps) => {
    const sizeClass = avatarSizes[size];
    const pixelSize = imageSizes[size];

    if (avatarUrl) {
        return (
            <Image
                src={avatarUrl}
                alt={fullName}
                width={pixelSize}
                height={pixelSize}
                className={cn(
                    sizeClass,
                    `inline rounded-full border  group-hover:border-2 group-hover:border-foreground-muted transition-all duration-100`
                )}
            />
        )
    }

    return (
        <User2
            className={cn(
                sizeClass,
                iconPadding[size],
                `inline rounded-full border group-hover:border-2 group-hover:border-foreground-muted transition-all duration-100`
            )}
        />
    )
}

export default UserAvatar;