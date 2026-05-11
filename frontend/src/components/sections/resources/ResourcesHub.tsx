"use client";
import Link from "next/link";
import { BookOpen, Clock, Archive, Upload, Share2, ChevronRight } from "lucide-react";
import { ContainerBox } from "@/components/ui/ContainerBox";
import Button from "@/components/ui/Button";
import { useMe, useRecentNotes, useArchivedNotes } from "@/hooks/queries/use-me";
import { SemesterLabel } from "@/types/entities";

interface ResourceOptionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    featured?: boolean;
}

const ResourceOption = ({
    icon,
    title,
    description,
    href,
    featured = false,
}: ResourceOptionProps) => (
    <Link href={href}>
        <div className="group relative py-4 px-4 rounded-lg transition-all duration-300 cursor-pointer border hover:border-border-hover hover:bg-background-secondary">
            <div className="flex items-center gap-4">
                <div
                    className={`mt-1 p-2 rounded-lg transition-colors duration-300 shrink-0 ${featured
                        ? "bg-accent text-foreground-inverse"
                        : "bg-background-tertiary text-foreground group-hover:text-accent"
                        }`}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-foreground-secondary mt-1">{description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground-tertiary group-hover:text-foreground transition-all duration-300 mt-0.5" />
            </div>
        </div>
    </Link>
);


const ResourcesHub = () => {
    const { data: userData, /* isLoading */ } = useMe();
    const { data: recentNotes = [] } = useRecentNotes();
    const { data: archivedNotes = [] } = useArchivedNotes();
    const profile = userData?.profile;

    const displayedRecentNotes = (recentNotes || []).slice(0, 2);
    const displayedArchivedNotes = (archivedNotes || []).slice(0, 2);

    return (
        <div className="space-y-8">
            {/* Main Content */}
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Resources Hub
                </h1>
                <p className="text-foreground-secondary text-base leading-relaxed">
                    Manage your study materials, share with peers, and explore resources.
                </p>
            </div>

            <div className="flex md:flex-row flex-col gap-8">
                {/* Library Items */}
                <div className="flex flex-col gap-2 2xl:flex-1">
                    {/* Current Semester - Featured */}
                    <Link
                        href={profile?.program && profile?.semester ? "/resources/current" : "#"}
                    >
                        <div className="group relative py-4 px-4 rounded-lg transition-all duration-300 cursor-pointer border border-accent bg-background hover:border-accent-hover hover:shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="mt-1 p-2 rounded-lg bg-accent text-foreground-inverse shrink-0">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-foreground">
                                        Current Semester
                                    </h3>
                                    {profile?.program && profile?.semester ? (
                                        <p className="text-sm text-foreground-secondary mt-1">
                                            Browse resources for <span className="font-medium text-foreground">{profile.program.code}</span>, <span className="font-medium text-foreground">{SemesterLabel[profile.semester]} Semester</span>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-foreground-secondary mt-1">
                                            Complete your profile to view your resources
                                        </p>
                                    )}
                                </div>
                                <ChevronRight className="w-5 h-5 text-accent group-hover:text-accent-hover transition-all duration-300 mt-0.5" />
                            </div>
                        </div>
                    </Link>

                    {/* Other Options */}
                    <ResourceOption
                        icon={<Clock className="w-5 h-5" />}
                        title="Recent Notes"
                        description="Continue where you left off. Jump back to your recently viewed notes."
                        href="/resources/me/recent"
                    />

                    <ResourceOption
                        icon={<Archive className="w-5 h-5" />}
                        title="Archived Notes"
                        description="Your saved and bookmarked notes for quick reference and study."
                        href="/resources/me/bookmarks"
                    />

                    <ResourceOption
                        icon={<Upload className="w-5 h-5" />}
                        title="My Uploads"
                        description="Track and manage all the notes and resources you've shared."
                        href="/resources/me/uploads"
                    />

                    <ResourceOption
                        featured
                        icon={<Share2 className="w-5 h-5" />}
                        title="Share Resources"
                        description="Upload notes, books, and past questions to help your peers learn."
                        href="/resources/share"
                    />
                </div>

                {/* Sidebar */}
                <div className="hidden md:flex flex-col flex-1 gap-6">
                    {/* Recently Accessed Notes */}
                    <ContainerBox title="Recently Accessed" comment="Your study journey">
                        {displayedRecentNotes && displayedRecentNotes.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {displayedRecentNotes.map((noteItem) => (
                                    <Link key={noteItem.noteId} href={`/resources/current`}>
                                        <div className="p-3 rounded-lg border border-border hover:border-border-hover hover:bg-background-secondary transition-all duration-300 cursor-pointer group">
                                            <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                                                {noteItem.note?.title || "Untitled"}
                                            </p>
                                            <p className="text-xs text-foreground-secondary mt-1 truncate">
                                                By {noteItem.note?.uploader?.fullName || "Unknown"}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full mt-4 text-foreground-secondary hover:text-foreground"
                                    href="/resources/me/recent"
                                    size="sm"
                                >
                                    View All Recent
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-foreground-secondary">
                                    No recently accessed notes yet.
                                </p>
                                <Button
                                    variant="ghost"
                                    className="w-full mt-4 text-foreground-secondary hover:text-foreground"
                                    href="/resources/current"
                                    size="sm"
                                >
                                    Explore Notes
                                </Button>
                            </div>
                        )}
                    </ContainerBox>

                    {/* Recently Archived Notes */}
                    <ContainerBox title="Recently Saved" comment="Your bookmarks">
                        {displayedArchivedNotes && displayedArchivedNotes.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {displayedArchivedNotes.map((noteItem) => (
                                    <Link key={noteItem.noteId} href={`/resources/current`}>
                                        <div className="p-3 rounded-lg border border-border hover:border-border-hover hover:bg-background-secondary transition-all duration-300 cursor-pointer group">
                                            <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                                                {noteItem.note?.title || "Untitled"}
                                            </p>
                                            <p className="text-xs text-foreground-secondary mt-1 truncate">
                                                By {noteItem.note?.uploader?.fullName || "Unknown"}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full mt-4 text-foreground-secondary hover:text-foreground"
                                    href="/resources/me/bookmarks"
                                    size="sm"
                                >
                                    View All Saved
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-sm text-foreground-secondary">
                                    No saved notes yet.
                                </p>
                                <Button
                                    variant="ghost"
                                    className="w-full mt-4 text-foreground-secondary hover:text-foreground"
                                    href="/resources/current"
                                    size="sm"
                                >
                                    Start Saving
                                </Button>
                            </div>
                        )}
                    </ContainerBox>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-12 pt-8 border-t">
                <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">Learning Tips</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-background-secondary border">
                            <p className="text-sm text-foreground font-medium">Organize & Save</p>
                            <p className="text-xs text-foreground-secondary mt-2">Bookmark important notes and create your personal library for quick access.</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background-secondary border">
                            <p className="text-sm text-foreground font-medium">Share & Contribute</p>
                            <p className="text-xs text-foreground-secondary mt-2">Upload your notes to help peers learn. Your contribution makes a difference.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesHub;
