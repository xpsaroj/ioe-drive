"use client"
import { useUser } from "@clerk/nextjs"

import StatStrip from "@/components/ui/StatStrip"
import { useMe, useUploadedResources, useBookmarkedResourceIds, useRecentResources } from "@/hooks/queries/use-me"
import { SemesterLabel } from "@/types/entities"

const DashboardHero = () => {
    const { user } = useUser()
    const { data: userData } = useMe();
    const profile = userData?.profile;

    const { data: uploaded } = useUploadedResources(1);
    const { data: bookmarkedIds } = useBookmarkedResourceIds();
    const { data: recent } = useRecentResources(1);

    const hasProfile = !!(profile?.program && profile?.semester);

    return (
        <div className="flex flex-col gap-6 pb-6 border-b border-border sm:flex-row sm:items-end sm:justify-between">
            <div>
                {hasProfile && profile?.program && profile?.semester && (
                    <span className="inline-block mb-3 rounded-full bg-background-tertiary px-3 py-1 font-display text-[11px] uppercase tracking-wide text-foreground-secondary">
                        {profile.program.code} • {SemesterLabel[profile.semester]} Semester
                    </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, {user?.firstName || "User"}.</h1>
                <p className="text-foreground-secondary mt-2">
                    You&apos;re making steady progress this week. Pick up right where you left off.
                </p>
            </div>

            <StatStrip
                variant="inline"
                className="border border-border rounded-xl px-5 py-3"
                items={[
                    { href: "/library/uploads", label: "Uploaded", value: uploaded?.meta?.total },
                    { href: "/library/bookmarks", label: "Bookmarked", value: bookmarkedIds?.length },
                    { href: "/library/recent", label: "Viewed", value: recent?.meta?.total },
                ]}
            />
        </div>
    )
}

export default DashboardHero
