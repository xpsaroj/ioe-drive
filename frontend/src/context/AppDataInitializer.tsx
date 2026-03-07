"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs"

import { useMe } from "@/hooks/queries/use-me";
import { usePrograms } from "@/hooks/queries/use-academics";
import { useQueryClient } from "@tanstack/react-query";
import { meKeys } from "@/hooks/queries/use-me";
import { academicsKeys } from "@/hooks/queries/use-academics";

export function AppDataInitializer({
    children
}: {
    children: React.ReactNode
}) {
    const { isSignedIn } = useAuth();
    const queryClient = useQueryClient();

    // Preload essential user data and programs on app initialization
    const { } = useMe();
    const { } = usePrograms();

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