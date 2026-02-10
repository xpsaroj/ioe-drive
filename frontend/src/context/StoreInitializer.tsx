"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchMyProfile } from "@/lib/store/features/me/me.thunks";
import { selectMyProfile } from "@/lib/store/features/me/me.selectors";

export function StoreInitializer({
    children
}: {
    children: React.ReactNode
}) {
    const { isSignedIn } = useAuth();

    const dispatch = useAppDispatch();
    const myProfile = useAppSelector(selectMyProfile);
    
    useEffect(() => {
        if (isSignedIn) {
            if (!myProfile) {
                dispatch(fetchMyProfile());
            }
        }
    }, [dispatch, myProfile, isSignedIn]);

    return <>{children}</>;
}