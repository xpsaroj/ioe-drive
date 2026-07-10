"use client"
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { ResourceList, RecentResourceCard, ResourcePageStateHandler } from "@/components/common/resources";
import Button from "@/components/ui/Button";
import Pagination from "@/components/ui/Pagination";
import Loader from "@/components/ui/Loader";
import { useRecentResources } from "@/hooks/queries/use-me";
import { usePageParam } from "@/hooks/use-page-param";

const MyRecentResourcesContent = () => {
    const router = useRouter();
    const { page, setPage } = usePageParam();
    const { data, isPending, error, isPlaceholderData } = useRecentResources(page);
    const recentResources = data?.items;

    // Reachable from more than one place (dashboard, library hub) - a real back button
    // is more reliable than assuming the breadcrumb's own first crumb is where the
    // visitor actually came from.
    const backButton = (
        <Button
            icon={<ChevronLeft className="size-4" />}
            iconOnly
            variant="ghost"
            size="xs"
            className="border border-border shrink-0"
            onClick={() => router.back()}
            aria-label="Go back"
        />
    );

    return (
        <ResourcePageStateHandler
            title="My Recent Resources"
            breadcrumbs={[{ label: "Library", href: "/library" }, { label: "Recent" }]}
            beforeBreadcrumb={backButton}
            isPending={isPending}
            error={error}
            isEmpty={!recentResources || recentResources.length === 0}
            loaderText="Loading recent resources. Please wait."
            emptyTitle="Oops. Looks like you haven't viewed any resources recently."
            emptyDescription="Start exploring resources for your subjects to see them here."
            emptyButtonText="Explore Resources"
            emptyButtonHref="/resources"
        >
            <div className="space-y-6">
                <ResourceList
                    resources={recentResources || []}
                    renderItem={(item) => (
                        <RecentResourceCard item={item} />
                    )}
                />
                <Pagination
                    page={page}
                    totalPages={data?.meta?.totalPages ?? 1}
                    onPageChange={setPage}
                    disabled={isPlaceholderData}
                />
            </div>
        </ResourcePageStateHandler>
    )
}

const MyRecentResourcesPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <Loader text="Loading recent resources. Please wait." />
            </div>
        }>
            <MyRecentResourcesContent />
        </Suspense>
    );
}

export default MyRecentResourcesPage;
