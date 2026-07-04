"use client"
import { UserProfile } from "@clerk/nextjs";
import { useState } from "react";
import { User2, Pencil } from "lucide-react";

import { useMe } from "@/hooks/queries/use-me";

type ProfileTab = "view" | "edit";

const ProfilePage = () => {
    const { data: userData } = useMe();
    const profile = userData?.profile;

    const [activeTab, setActiveTab] = useState<ProfileTab>("view");

    const profileDetails = [
        { label: "Bio", value: profile?.bio || "No bio set." },
        { label: "College", value: profile?.college || "No college set." },
        { label: "Program", value: profile?.program?.name || "No program set." },
        { label: "Semester", value: profile?.semester || "No semester set." },
    ]

    return (
        <div className="flex flex-col items-center p-16">
            <div className="max-w-7xl space-y-16">
                {/* Clerk Account Settings */}
                <div className="flex flex-col items-start justify-start w-full">
                    <h2 className="text-xl text-left font-bold mb-4">Account Details</h2>
                    <UserProfile />
                </div>

                {/* Profile Settings */}
                <div className="flex flex-col items-start justify-start w-full">
                    <h2 className="text-xl font-bold mb-4">Profile Details</h2>
                    <div className="w-full flex flex-row divide-x divide-border-secondary rounded-xl border border-border-secondary shadow-[0_8px_30px_var(--color-shadow-lg)]">
                        {/* Profile Tabs: View or Edit */}
                        <div className="px-4 py-6 min-w-56 bg-background-tertiary rounded-l-xl">
                            <div className="px-2">
                                <h2 className="text-xl font-bold">Profile</h2>
                                <span className="text-sm text-secondary">Manage your profile info.</span>
                            </div>

                            <div className="px-0 mt-4 flex flex-col items-start gap-1">
                                <button
                                    className={`w-full text-start px-3 py-1 rounded-md cursor-pointer ${activeTab === "view" ? "bg-primary/15" : "hover:bg-primary/5"} transition-all duration-300`}
                                    onClick={() => setActiveTab("view")}
                                >
                                    <User2 className="size-4 mr-1 inline text-foreground border rounded-full" /> Profile
                                </button>
                                <button
                                    className={`w-full text-start px-3 py-1 rounded-md cursor-pointer ${activeTab === "edit" ? "bg-primary/15" : "hover:bg-primary/5"} transition-all duration-300`}
                                    onClick={() => setActiveTab("edit")}
                                >
                                    <Pencil className="size-4 mr-1 inline text-foreground" /> Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="p-6 flex-1">
                            <div>
                                <h3 className="text-lg font-semibold">Profile info</h3>
                                <hr className="mt-3 text-border" />
                            </div>

                            <div className="w-full divide-y divide-border">
                                {
                                    profileDetails.map((detail) => (
                                        <div key={detail.label} className="flex flex-row gap-10 py-4">
                                            <p className="w-1/4 text-primary">{detail.label}</p>
                                            <p className="text-secondary">{detail.value}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;