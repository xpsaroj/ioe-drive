import Image from "next/image";
import { User2 } from "lucide-react";
import { UserButton, ClerkLoading, ClerkLoaded, useClerk } from "@clerk/nextjs";
import { useRef } from "react";

import { useMe } from "@/hooks/queries/use-me";
import { SemesterLabel } from "@/types";

export const User = () => {
    const { user } = useClerk();
    const { data: userData, isLoading, error } = useMe();
    const profile = userData ? userData?.profile : null;

    const buttonRef = useRef<HTMLDivElement>(null);

    const handleOpenMenu = () => {
        const btn = buttonRef.current?.querySelector("button");
        btn?.click(); // triggers Clerk popup
    };

    return (
        <div
            onClick={handleOpenMenu}
            className="flex flex-row justify-between items-center gap-2 cursor-pointer relative overflow-hidden"
        >
            <div className="flex items-center justify-center gap-2">

                {/* Avatar */}
                <div className="size-5 lg:size-9 relative rounded-full overflow-hidden border">
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

                <div className="flex flex-col">
                    <div className="block md:hidden lg:block flex-col">
                        <h2 className="text-primary">{user?.fullName || "User"}</h2>
                        {isLoading ? (
                            <p className="text-xs text-foreground-secondary">Loading...</p>
                        ) : error ? (
                            <p className="text-xs text-error">Error loading profile</p>
                        ) : profile && (
                            <p className="text-xs text-foreground-secondary text-ellipsis overflow-hidden whitespace-nowrap">
                                {profile?.semester && `${SemesterLabel[profile?.semester]}`}
                                {profile?.program && `, ${profile?.program.code}`}
                                {profile?.college && `, ${profile?.college.trim().split(" ")[0]}`}
                            </p>
                        )}
                    </div>


                    <h2 className="hidden md:block lg:hidden text-primary">
                        {user?.fullName?.split(" ").map(n => n[0]).join("") || "U"}
                    </h2>

                </div>
            </div>

            {/* Hidden UserButton */}
            <div ref={buttonRef} className="absolute bottom-0 right-0 opacity-0 -mb-2 pointer-events-none">
                <UserButton />
            </div>
        </div>
    );
};