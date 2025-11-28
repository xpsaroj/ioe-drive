import { ClerkLoaded, ClerkLoading, ClerkFailed } from "@clerk/nextjs"

/**
 *  GlobalLoader component to handle loading states for the entire app.
 *  It displays a loading spinner while Clerk is loading and an error message if loading fails.
 * @param children - The child components to render once loading is complete. 
 */
export default function GlobalLoader({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ClerkLoading>
                <div className="fixed inset-0 flex items-center justify-center bg-background z-9999">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
                </div>
            </ClerkLoading>

            <ClerkFailed>
                <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
                    <div className="text-red-500">Something went wrong. Please refresh the page.</div>
                </div>
            </ClerkFailed>

            <ClerkLoaded>
                {children}
            </ClerkLoaded>
        </>
    )
}