"use client"
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Breadcrumbs } from "@/components/layout";
import { ResourceList, ResourceCard } from "@/components/common/resources";
import { SubjectCodeTile } from "@/components/common/offering";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Loader from "@/components/ui/Loader";
import { useSearchResources } from "@/hooks/queries/use-resources";
import { useSearchSubjects } from "@/hooks/queries/use-academics";
import { usePageParam } from "@/hooks/use-page-param";
import { SemesterLabel } from "@/types/entities";

const SUBJECT_RESULTS_SHOWN = 6;

const SearchContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const q = searchParams.get("q")?.trim() ?? "";
    const { page, setPage } = usePageParam();

    const { data: subjectsData, isPending: subjectsPending } = useSearchSubjects(q, 1, SUBJECT_RESULTS_SHOWN);
    const {
        data: resourcesData,
        isLoading: resourcesLoading,
        error: resourcesError,
        isPlaceholderData: resourcesPlaceholder,
    } = useSearchResources(q, page);

    const subjects = subjectsData?.items ?? [];
    const resources = resourcesData?.items ?? [];

    return (
        <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto md:px-8 px-6 md:py-8 py-6 space-y-8">
            <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background/95 py-2.5 backdrop-blur-sm">
                <Button
                    icon={<ChevronLeft className="size-4" />}
                    iconOnly
                    variant="ghost"
                    size="xs"
                    className="border border-border shrink-0"
                    onClick={() => router.back()}
                    aria-label="Go back"
                />
                <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Search" }]} />
            </div>

            <div className="pb-6 border-b border-border">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {q ? <>Results for &ldquo;{q}&rdquo;</> : "Search"}
                </h1>
                <p className="text-foreground-secondary mt-1">
                    {q ? "Subjects and resources matching your search." : "Enter a search term to get started."}
                </p>
            </div>

            {q && (
                <div className="space-y-8">
                    {!subjectsPending && subjects.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-medium text-foreground-secondary">Subjects</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {subjects.map((offering) => (
                                    <Link
                                        key={offering.id}
                                        href={`/offerings/${offering.id}`}
                                        className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-accent hover:bg-background-hover"
                                    >
                                        <SubjectCodeTile code={offering.subject.code} size="md" />
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-foreground">{offering.subject.name}</p>
                                            <p className="truncate text-xs text-foreground-secondary">
                                                {offering.subject.code}, {offering.program.code}, {SemesterLabel[offering.semester]} Semester
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <h2 className="text-sm font-medium text-foreground-secondary">Resources</h2>
                        <ResourceList
                            resources={resources}
                            loading={resourcesLoading}
                            error={resourcesError ? "Failed to load results. Please try again." : null}
                            renderItem={(resource) => <ResourceCard resource={resource} />}
                            emptyMessage={`No resources found for "${q}".`}
                        />
                        <Pagination
                            page={page}
                            totalPages={resourcesData?.meta?.totalPages ?? 1}
                            onPageChange={setPage}
                            disabled={resourcesPlaceholder}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const SearchPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading search results. Please wait." />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
};

export default SearchPage;
