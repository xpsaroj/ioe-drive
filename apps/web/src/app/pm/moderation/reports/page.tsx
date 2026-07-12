"use client";
import { Suspense } from "react";

import { ResourceList } from "@/components/common/resources";
import { ReportRow } from "@/components/common/moderation";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";
import { useReports } from "@/hooks/queries/use-moderation";
import { usePageParam } from "@/hooks/use-page-param";

const ReportsQueueContent = () => {
    const { page, setPage } = usePageParam();
    const { data, isPending, error, isPlaceholderData } = useReports(page);

    return (
        <div className="space-y-6">
            <ResourceList
                resources={data?.items || []}
                loading={isPending}
                error={error ? "Failed to load reports" : null}
                emptyMessage="No open reports - every reported resource has been reviewed."
                renderItem={(report) => <ReportRow report={report} />}
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

const ReportsQueuePage = () => (
    <Suspense fallback={
        <div className="flex items-center justify-center py-16">
            <Loader text="Loading reports. Please wait." />
        </div>
    }>
        <ReportsQueueContent />
    </Suspense>
);

export default ReportsQueuePage;
