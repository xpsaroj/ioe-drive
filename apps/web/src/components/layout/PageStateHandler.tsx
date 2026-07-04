"use client";
import Loader from "@/components/ui/Loader";

interface PageStateHandlerProps {
    /**
     * Whether data is currently being loaded
     */
    isPending: boolean;

    /**
     * Error object if something went wrong (truthy = error state)
     */
    error: Error | null | undefined;

    /**
     * Whether the data is empty (no results)
     */
    isEmpty: boolean;

    /**
     * Text to display in the loader
     * @default "Loading. Please wait."
     */
    loaderText?: string;

    /**
     * Content to render in the error state
     * If not provided, a default error message will be shown
     */
    errorContent?: React.ReactNode;

    /**
     * Content to render in the empty state
     * If not provided, a default empty message will be shown
     */
    emptyContent?: React.ReactNode;

    /**
     * Main content to render when data is loaded successfully
     */
    children: React.ReactNode;

    /**
     * Optional CSS classes for the container
     * @default "min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto"
     */
    containerClassName?: string;

    /**
     * Optional CSS classes for the state content wrapper (loading/error/empty states)
     * @default "flex-1 flex items-center justify-center border rounded-lg"
     */
    stateContainerClassName?: string;

    /**
     * Optional header content to render at the top of the page (appears in all states)
     * Usually includes title and back button
     */
    header?: React.ReactNode;
}

/**
 * Generic page state handler component for managing loading, error, and empty states
 * 
 * @example
 * ```tsx
 * const { data, isPending, error } = useMyData();
 * 
 * return (
 *   <PageStateHandler
 *     isPending={isPending}
 *     error={error}
 *     isEmpty={!data || data.length === 0}
 *     loaderText="Loading your data..."
 *     header={
 *       <div className="flex items-center gap-2 mb-4">
 *         <BackButton />
 *         <h1 className="text-2xl font-medium">My Page</h1>
 *       </div>
 *     }
 *   >
 *     <YourContentComponent data={data} />
 *   </PageStateHandler>
 * );
 * ```
 */
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
    // Loading state
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

    // Error state
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

    // Empty state
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

    // Content state
    return (
        <div className={containerClassName}>
            {header}
            {children}
        </div>
    );
};

export default PageStateHandler;
