"use client";
import { PageHeader, PageStateHandler, type BreadcrumbItem } from "@/components/layout";
import Button from "@/components/ui/Button";

interface ResourcePageStateHandlerProps {
    title: React.ReactNode;
    breadcrumbs: BreadcrumbItem[];
    /** Optional right-aligned content next to the title (e.g. bookmark/edit/delete). */
    actions?: React.ReactNode;
    /** Rendered before the breadcrumb trail inside its sticky bar, e.g. a back button. See PageHeader. */
    beforeBreadcrumb?: React.ReactNode;
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
    actions,
    beforeBreadcrumb,
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
    const headerSection = (
        <PageHeader title={title} breadcrumbs={breadcrumbs} actions={actions} beforeBreadcrumb={beforeBreadcrumb} />
    );

    const emptyContent = (
        <div className="flex flex-col items-center justify-center gap-1">
            <p className="">{emptyTitle}</p>
            <p className="text-sm text-foreground-secondary pb-1 md:max-w-xl text-center">
                {emptyDescription}
            </p>
            <Button href={emptyButtonHref}>{emptyButtonText}</Button>
        </div>
    )

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
