'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api/api-client';

export function ClerkApiProvider({ children }: { children: React.ReactNode }) {
    const { getToken, isLoaded } = useAuth();

    useEffect(() => {
        if (!isLoaded) return;

        apiClient.setTokenProvider(async () => {
            return await getToken();
        });
    }, [isLoaded, getToken]);

    return <>{children}</>;
}