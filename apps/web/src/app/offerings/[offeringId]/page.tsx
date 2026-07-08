"use client"
import { useRouter } from "next/navigation";
import { use } from "react"
import { ChevronLeft } from "lucide-react"

import Button from "@/components/ui/Button";
import { PageStateHandler, Breadcrumbs } from "@/components/layout";
import { useSubjectDetails } from "@/hooks/queries/use-academics";
import { SubjectOfferingDetails } from "@/components/common/offering";

interface OfferingPageProps {
    params: Promise<{ offeringId: string }>
}

const OfferingPage = ({
    params
}: OfferingPageProps) => {
    const router = useRouter();
    const { offeringId } = use(params)
    const { data: offering, isPending, error } = useSubjectDetails(Number(offeringId));

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
            <Breadcrumbs items={[{ label: "Offerings", href: "/offerings" }, { label: offering?.subject.code ?? "Offering Details" }]} />
        </div>
    )

    const emptyContent = (
        <div className="flex flex-col justify-center items-center">
            <p className="text-4xl">404</p>
            <p className="text-foreground-secondary">Oops! The subject offering you are looking for does not exist.</p>
        </div>
    )

    return (
        <PageStateHandler
            isPending={isPending}
            error={error}
            isEmpty={!offering}
            header={header}
            loaderText="Loading offering details. Please wait."
            emptyContent={emptyContent}
        >
            {offering && (
                <SubjectOfferingDetails offering={offering} />
            )}
        </PageStateHandler>
    )
}

export default OfferingPage;