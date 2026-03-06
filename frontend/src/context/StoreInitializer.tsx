"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchMyProfile } from "@/lib/store/features/me/me.thunks";
import { fetchPrograms } from "@/lib/store/features/academics/academics.thunks";
import { selectMyProfile } from "@/lib/store/features/me/me.selectors";
import { clearMeState } from "@/lib/store/features/me/me.slice";

export function StoreInitializer({
    children
}: {
    children: React.ReactNode
}) {
    const { isSignedIn } = useAuth();

    const dispatch = useAppDispatch();
    const myProfile = useAppSelector(selectMyProfile);

    useEffect(() => {
        dispatch(fetchPrograms());
    }, [dispatch])

    useEffect(() => {
        if (isSignedIn) {
            if (!myProfile.data && !myProfile.loading) {
                dispatch(fetchMyProfile());
            }
        }
    }, [dispatch, myProfile, isSignedIn]);

    // Listen for sign-out events and perform global cleanup
    useEffect(() => {
        if (!isSignedIn) {
            // Clear any user-specific state in the application when the user signs out
            dispatch(clearMeState())
        }
    }, [isSignedIn]);

    return <>{children}</>;
}