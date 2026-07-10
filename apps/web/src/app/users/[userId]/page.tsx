"use client"
import { Suspense, use } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import { useUserById } from "@/hooks/queries/use-user"
import { useResourcesByUploaderId } from "@/hooks/queries/use-resources"
import { usePageParam } from "@/hooks/use-page-param"
import { PageStateHandler, Breadcrumbs } from "@/components/layout"
import { UserAvatar } from "@/components/common/user"
import Pagination from "@/components/ui/Pagination"
import Button from "@/components/ui/Button"
import Loader from "@/components/ui/Loader"
import { SemesterLabel } from "@/types/entities"
import { ResourceList, UploadedResourceCard } from "@/components/common/resources";

interface UserDetailsPageProps {
    params: Promise<{
        userId: string
    }>
}

// No upvote system exists in the data model yet - this is a purely cosmetic placeholder
// (tracked in docs/todo.md) until a real feature backs it. The derivation gives each
// profile a small, stable per-user variance rather than an identical number for
// everyone - it doesn't mean anything beyond "looks distinct."
const getPlaceholderUpvoteCount = (userId: number) => 50 + ((userId * 83) % 900);

const UserDetailsContent = ({ userId }: { userId: number }) => {
    const router = useRouter();
    const { page, setPage } = usePageParam();

    const {
        data: user,
        isPending: userPending,
        error: userLoadError
    } = useUserById(userId);

    const {
        data: resourcesData,
        isPending: resourcesPending,
        error: resourcesLoadError,
        isPlaceholderData: resourcesPlaceholder,
    } = useResourcesByUploaderId(userId, page);
    const resources = resourcesData?.items;

    // "Community" is the only sensible parent for a user profile today, even though
    // that section itself is still just a placeholder page - a real back button sits
    // ahead of it since there's otherwise no way back to wherever this profile was
    // actually reached from.
    const header = (
        <div className="sticky top-0 z-10 mb-6 flex items-center gap-2 border-b border-border bg-background/95 py-2.5 backdrop-blur-sm">
            <Button
                icon={<ChevronLeft className="size-4" />}
                iconOnly
                variant="ghost"
                size="xs"
                className="border border-border shrink-0"
                onClick={() => router.back()}
                aria-label="Go back"
            />
            <Breadcrumbs items={[{ label: "Community", href: "/community" }, { label: "User Profile" }]} />
        </div>
    );

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">The user you are looking for does not exist.</p>
        </div>
    )

    if (!userId || isNaN(userId) || !user) {
        return (
            <PageStateHandler
                isPending={userPending}
                error={userLoadError}
                isEmpty={true}
                loaderText="Loading user details. Please wait."
                emptyContent={emptyContent}
                header={header}
            >
                {null}
            </PageStateHandler>
        )
    }

    const { profile } = user;
    const joinedShort = new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
    });

    // Program (code) - Semester - College, skipping whichever pieces aren't set rather
    // than showing "Not specified" placeholders inline.
    const profileLine = [
        profile?.program && `${profile.program.name} (${profile.program.code})`,
        profile?.semester && `${SemesterLabel[profile.semester]} Semester`,
        profile?.college,
    ].filter(Boolean).join(" - ");

    return (
        <PageStateHandler
            isPending={userPending}
            error={userLoadError}
            isEmpty={!user}
            loaderText="Loading user details. Please wait."
            emptyContent={emptyContent}
            header={header}
        >
            {user && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="flex h-full flex-col justify-center space-y-4 rounded-xl border border-border p-6 lg:col-span-2">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <UserAvatar
                                    fullName={user.fullName}
                                    avatarUrl={profile?.profilePictureUrl}
                                    size="xl"
                                />

                                <div className="min-w-0 flex-1 space-y-2">
                                    <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        {user.fullName}
                                    </h1>

                                    <p className="text-foreground-secondary">
                                        {profileLine || "Profile details not set yet."}
                                    </p>

                                    {profile?.bio ? (
                                        <p className="max-w-2xl text-sm leading-relaxed text-foreground-secondary md:text-base">
                                            {profile.bio}
                                        </p>
                                    ) : (
                                        <p className="text-sm italic text-foreground-tertiary">
                                            This user has not added a bio yet.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="h-full rounded-xl border border-border p-6">
                            <p className="mb-2 font-display text-xs font-medium uppercase tracking-wide text-foreground-tertiary">
                                Academic Standing
                            </p>
                            <div className="divide-y divide-border">
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-foreground-secondary">Contributions</span>
                                    <span className="text-lg font-semibold text-foreground">
                                        {resourcesData?.meta?.total ?? 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-foreground-secondary">Upvotes</span>
                                    <span className="text-lg font-semibold text-foreground">
                                        {getPlaceholderUpvoteCount(user.id)}+
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-foreground-secondary">Joined</span>
                                    <span className="font-display text-sm text-foreground-tertiary">
                                        {joinedShort}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <PageStateHandler
                        isPending={resourcesPending}
                        error={resourcesLoadError}
                        isEmpty={resources ? resources.length === 0 : true}
                        loaderText="Loading user's uploaded resources. Please wait."
                        emptyContent={
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-2xl">No resources uploaded yet.</p>
                                <p className="text-foreground-secondary">This user has not uploaded any resources.</p>
                            </div>
                        }
                        containerClassName=""
                        header={
                            <h2 className="text-xl font-medium mb-2">
                                Uploaded Resources
                            </h2>
                        }
                    >
                        <div className="space-y-6">
                            <ResourceList
                                resources={resources || []}
                                renderItem={(item) => (
                                    <UploadedResourceCard
                                        item={item}
                                    />
                                )}
                            />
                            <Pagination
                                page={page}
                                totalPages={resourcesData?.meta?.totalPages ?? 1}
                                onPageChange={setPage}
                                disabled={resourcesPlaceholder}
                            />
                        </div>
                    </PageStateHandler>
                </div>
            )}
        </PageStateHandler>
    )
}

const UserDetailsPage = ({ params }: UserDetailsPageProps) => {
    const { userId: uId } = use(params)
    const userId = Number(uId);

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading user details. Please wait." />
            </div>
        }>
            <UserDetailsContent userId={userId} />
        </Suspense>
    );
}

export default UserDetailsPage;