"use client";
import Loader from "@/components/ui/Loader";

interface PageStateHandlerProps {
    isPending: boolean;
    error: Error | null | undefined;
    isEmpty: boolean;
    loaderText?: string;
    errorContent?: React.ReactNode;
    emptyContent?: React.ReactNode;
    children: React.ReactNode;
    containerClassName?: string;
    stateContainerClassName?: string;
    /** Rendered at the top of the page in every state - usually a title and back button. */
    header?: React.ReactNode;
}

const PageStateHandler = ({
    isPending,
    error,
    isEmpty,
    loaderText = "Loading. Please wait.",
    errorContent,
    emptyContent,
    children,
    header,
    containerClassName = "min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto",
    stateContainerClassName = "flex-1 flex items-center justify-center border rounded-lg",
}: PageStateHandlerProps) => {
    if (isPending) {
        return (
            <div className={containerClassName}>
                {header}
                <div className={stateContainerClassName}>
                    <Loader text={loaderText} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={containerClassName}>
                {header}
                <div className={stateContainerClassName}>
                    {errorContent || (
                        <p className="text-error">Something went wrong. Please try again later.</p>
                    )}
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className={containerClassName}>
                {header}
                <div className={stateContainerClassName}>
                    {emptyContent || <p className="text-foreground-secondary">No data found.</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={containerClassName}>
            {header}
            {children}
        </div>
    );
};

export default PageStateHandler;
