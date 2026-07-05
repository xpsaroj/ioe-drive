"use client"
import { useUser } from "@clerk/nextjs"
import { BookOpen, Upload } from "lucide-react"

import Button from "@/components/ui/Button"
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
        <div>
            <div className="flex flex-col items-start sm:flex-row sm:justify-between gap-3">
                <div>
                    <p className="font-display text-xs tracking-[0.2em] uppercase text-foreground-tertiary mb-2">
                        Dashboard
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome back, {user?.firstName || "User"}!</h1>
                    <p className="text-foreground-secondary mt-2">What would you like to do today?</p>
                </div>

                {hasProfile && profile?.program && profile?.semester && (
                    <span className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1.5 font-display text-xs uppercase tracking-wide text-foreground-secondary shrink-0">
                        {profile.program.code} • {SemesterLabel[profile.semester]} Semester
                    </span>
                )}
            </div>

            <StatStrip
                className="mt-6"
                items={[
                    { href: "/library/uploads", label: "Uploaded", value: uploaded?.meta?.total },
                    { href: "/library/bookmarks", label: "Bookmarked", value: bookmarkedIds?.length },
                    { href: "/library/recent", label: "Recently viewed", value: recent?.meta?.total },
                ]}
            />

            <div className="flex flex-wrap gap-3 mt-6">
                <Button href="/resources" variant="secondary" size="sm" icon={<BookOpen className="size-4" />}>
                    {hasProfile ? "Continue browsing resources" : "Browse resources"}
                </Button>
                <Button href="/resources/share" variant="ghost" size="sm" className="border border-border" icon={<Upload className="size-4" />}>
                    Share a resource
                </Button>
            </div>
        </div>
    )
}

export default DashboardHero
