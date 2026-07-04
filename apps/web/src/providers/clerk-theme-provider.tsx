"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";

/**
 * Wraps ClerkProvider so Clerk's own UI (SignIn, SignUp, UserProfile, UserButton, etc.)
 * follows the site's dark/light theme instead of always rendering with Clerk's default
 * light appearance. Individual pages can still layer their own `appearance` prop on a
 * specific Clerk component (e.g. the sign-in page's card styling) - that composes with
 * this base theme rather than replacing it.
 *
 * `resolvedTheme` is only known after mount (it depends on localStorage/system
 * preference), so we render with the default light appearance until then to avoid a
 * hydration mismatch, same as next-themes' own recommended pattern.
 */
export function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <ClerkProvider appearance={{ baseTheme: isDark ? dark : undefined }}>
            {children}
        </ClerkProvider>
    );
}
