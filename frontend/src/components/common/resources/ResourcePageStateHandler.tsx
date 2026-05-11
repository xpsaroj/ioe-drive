"use client";
import { ChevronLeft } from "lucide-react";

import Button from "@/components/ui/Button";
import { PageStateHandler } from "@/components/layout";

interface ResourcePageStateHandlerProps {
    title: string;
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
        <div className="flex items-center gap-2 mb-4">
            <Button
                icon={<ChevronLeft className="size-4" />}
                iconOnly
                href="/resources"
                variant="ghost"
                size="xs"
                className="border border-border"
            />
            <h3 className="text-xl md:text-2xl font-medium">{title}</h3>
        </div>
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
