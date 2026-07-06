"use client";
import { PageHeader, PageStateHandler, type BreadcrumbItem } from "@/components/layout";
import Button from "@/components/ui/Button";

interface ResourcePageStateHandlerProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    isPending: boolean;
    error: Error | null | undefined;
    isEmpty: boolean;
    loaderText: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyButtonText: string;
    emptyButtonHref: string;
    children: React.ReactNode;
}

const ResourcePageStateHandler = ({
    title,
    breadcrumbs,
    isPending,
    error,
    isEmpty,
    loaderText,
    emptyTitle,
    emptyDescription,
    emptyButtonText,
    emptyButtonHref,
    children,
}: ResourcePageStateHandlerProps) => {
    const headerSection = <PageHeader title={title} breadcrumbs={breadcrumbs} />;

    const emptyContent = (
        <div className="flex flex-col items-center justify-center gap-1">
            <p className="">{emptyTitle}</p>
            <p className="text-sm text-foreground-secondary pb-1 md:max-w-xl text-center">
                {emptyDescription}
            </p>
            <Button href={emptyButtonHref}>{emptyButtonText}</Button>
        </div>
    )

    // Content state
    return (
        <PageStateHandler
            isPending={isPending}
            error={error}
            isEmpty={isEmpty}
            loaderText={loaderText}
            header={headerSection}
            emptyContent={emptyContent}
        >
            {children}
        </PageStateHandler>
    );
};

export default ResourcePageStateHandler;
