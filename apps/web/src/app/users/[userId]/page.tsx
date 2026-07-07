"use client"
import { Suspense, use } from "react"

import { useUserById } from "@/hooks/queries/use-user"
import { useResourcesByUploaderId } from "@/hooks/queries/use-resources"
import { usePageParam } from "@/hooks/use-page-param"
import { PageStateHandler } from "@/components/layout"
import { UserAvatar } from "@/components/common/user"
import Pagination from "@/components/common/Pagination"
import Loader from "@/components/ui/Loader"
import { SemesterLabel } from "@/types/entities"
import { ResourceList, UploadedResourceCard } from "@/components/common/resources";

interface UserDetailsPageProps {
    params: Promise<{
        userId: string
    }>
}

const UserDetailsContent = ({ userId }: { userId: number }) => {
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
            >
                {null}
            </PageStateHandler>
        )
    }

    const { profile } = user;
    const createdAt = new Date(user.createdAt)
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <PageStateHandler
            isPending={userPending}
            error={userLoadError}
            isEmpty={!user}
            loaderText="Loading user details. Please wait."
            emptyContent={emptyContent}
        >
            {user && (
                <div className="space-y-8">
                    <div className="flex flex-col justify-center border gap-6 rounded-lg py-3 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <UserAvatar
                                fullName={user.fullName}
                                avatarUrl={profile?.profilePictureUrl}
                                size={"xl"}
                            />

                            <div className="space-y-2">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-semibold">
                                        {user.fullName}
                                    </h1>
                                    <p className="text-sm text-foreground-secondary">
                                        Joined on {formattedCreatedAt}
                                    </p>
                                </div>

                                {profile?.bio && (
                                    <p className="text-sm md:text-base text-foreground-secondary max-w-2xl leading-relaxed">
                                        {profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="border rounded-lg p-4">
                                <p className="text-xs uppercase tracking-wide text-foreground-tertiary mb-1">
                                    Program
                                </p>

                                {profile?.program ? (
                                    <div>
                                        <p className="font-medium">
                                            {profile.program.name}
                                        </p>
                                        <p className="text-sm text-foreground-secondary">
                                            {profile.program.code}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-foreground-secondary">
                                        Not specified
                                    </p>
                                )}
                            </div>

                            <div className="border rounded-lg p-4">
                                <p className="text-xs uppercase tracking-wide text-foreground-tertiary mb-1">
                                    Semester
                                </p>

                                <p className="font-medium">
                                    {profile?.semester
                                        ? `${SemesterLabel[profile.semester]} Semester`
                                        : "Not specified"}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <p className="text-xs uppercase tracking-wide text-foreground-tertiary mb-1">
                                    College
                                </p>

                                <p className="font-medium">
                                    {profile?.college || "Not specified"}
                                </p>
                            </div>
                        </div>

                        {!profile?.bio && (
                            <div className="border rounded-lg p-4">
                                <p className="text-sm text-foreground-secondary">
                                    This user has not added a bio yet.
                                </p>
                            </div>
                        )}
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