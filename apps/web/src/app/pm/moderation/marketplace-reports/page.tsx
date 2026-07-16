"use client";
import { Suspense } from "react";

import { ResourceList } from "@/components/common/resources";
import { MarketplaceReportRow } from "@/components/common/moderation";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import { useMarketplaceReports } from "@/hooks/queries/use-moderation";
import { usePageParam } from "@/hooks/use-page-param";

const MarketplaceReportsQueueContent = () => {
    const { page, setPage } = usePageParam();
    const { data, isPending, error, isPlaceholderData } = useMarketplaceReports(page);

    return (
        <div className="space-y-6">
            <ResourceList
                resources={data?.items || []}
                loading={isPending}
                error={error ? "Failed to load reports" : null}
                emptyMessage="No open reports - every reported listing has been reviewed."
                renderItem={(report) => <MarketplaceReportRow report={report} />}
            />
            <Pagination
                page={page}
                totalPages={data?.meta?.totalPages ?? 1}
                onPageChange={setPage}
                disabled={isPlaceholderData}
            />
        </div>
    );
};

const MarketplaceReportsQueuePage = () => (
    <Suspense fallback={
        <div className="flex items-center justify-center py-16">
            <Loader text="Loading reports. Please wait." />
        </div>
    }>
        <MarketplaceReportsQueueContent />
    </Suspense>
);

export default MarketplaceReportsQueuePage;
