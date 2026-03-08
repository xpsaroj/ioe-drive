"use client";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query";

import { meKeys } from "@/hooks/queries/use-me";
import { academicsKeys } from "@/hooks/queries/use-academics";

export function AuthStateWatcher({
    children
}: {
    children: React.ReactNode
}) {
    const { isSignedIn } = useAuth();
    const queryClient = useQueryClient();

    // Listen for sign-out events and perform global cleanup
    useEffect(() => {
        if (!isSignedIn) {
            // Clear any user-specific state in the application when the user signs out
            queryClient.removeQueries({ queryKey: meKeys.all });
            queryClient.removeQueries({ queryKey: [...academicsKeys.all, "subject-offerings"] });

        }
    }, [isSignedIn, queryClient]);

    return <>{children}</>;
}