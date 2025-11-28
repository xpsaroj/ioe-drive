import Image from "next/image";
import { User2, ChevronDown } from "lucide-react";
import { UserButton, ClerkLoading, ClerkLoaded, useClerk } from "@clerk/nextjs";
import { useRef } from "react";

export const User = () => {
    const { user } = useClerk();

    const buttonRef = useRef<HTMLDivElement>(null);

    const handleOpenMenu = () => {
        const btn = buttonRef.current?.querySelector("button");
        btn?.click(); // triggers Clerk popup
    };

    return (
        <div
            onClick={handleOpenMenu}
            className="flex flex-row justify-center items-center gap-2 p-1.5 border border-muted rounded-full cursor-pointer relative"
        >
            {/* Avatar */}
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-muted">
                <ClerkLoading>
                    <User2 className="h-full w-full p-3" />
                </ClerkLoading>

                <ClerkLoaded>
                    {
                        user?.imageUrl ?
                            <Image
                                src={user.imageUrl}
                                alt="User avatar"
                                fill
                                className="object-cover"
                            />
                            : <User2 className="h-full w-full p-3" />
                    }
                </ClerkLoaded>
            </div>

            {/* User info */}
            <div className="flex flex-col">
                <h2 className="text-primary">{user?.fullName || "User"}</h2>
                <p className="text-secondary text-xs">5th, BCT, Pulchowk</p>
            </div>

            <ChevronDown className="size-5 text-accent" />

            {/* Hidden UserButton */}
            <div ref={buttonRef} className="absolute bottom-0 right-0 opacity-0 -mb-2 pointer-events-none">
                <UserButton />
            </div>
        </div>
    );
};
