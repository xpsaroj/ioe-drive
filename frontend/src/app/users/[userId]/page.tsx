"use client"
import { use } from "react"

import { useUserById } from "@/hooks/queries/use-user"
import { PageStateHandler } from "@/components/layout"
import { UserAvatar } from "@/components/common/user"
import { SemesterLabel } from "@/types/entities"

interface UserDetailsPageProps {
    params: Promise<{
        userId: string
    }>
}

const UserDetailsPage = ({ params }: UserDetailsPageProps) => {
    const { userId: uId } = use(params)
    const userId = Number(uId);

    const { data: user, isPending, error } = useUserById(userId);
    console.log("User:", user)

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">The user you are looking for does not exist.</p>
        </div>
    )

    if (!userId || isNaN(userId) || !user) {
        return (
            <PageStateHandler
                isPending={isPending}
                error={error}
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
            isPending={isPending}
            error={error}
            isEmpty={!user}
            loaderText="Loading user details. Please wait."
            emptyContent={emptyContent}
        >
            {user && (
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
            )}
        </PageStateHandler>
    )
}

export default UserDetailsPage;