'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,   // Data considered fresh for 5 minutes
                        gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
                        refetchOnWindowFocus: false, // Don't refetch on window focus
                        retry: 1,   // Retry failed requests once
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Only in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}