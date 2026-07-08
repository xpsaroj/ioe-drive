"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@clerk/nextjs';
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";

interface LogoProps {
    /**
     * Which logo color variant to render. When omitted, defaults to the variant that
     * matches the site's current theme (the light-colored mark when the site is in dark
     * mode, the dark-colored mark otherwise) - pass this explicitly only when a specific
     * variant is needed regardless of theme.
     */
    theme?: "light" | "dark";
    size?: number;
    bg?: boolean;
    /**
     * When true, renders just the mark (no wrapping Link) - for callers that already
     * place the mark inside their own link/lockup (e.g. next to a wordmark), so the
     * icon and text share a single click target instead of nesting two anchors.
     */
    disableLink?: boolean;
}

export default function Logo({
    theme,
    size = 6,
    bg = true,
    disableLink = false,
}: LogoProps) {
    const { isSignedIn } = useAuth();
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();

    // The "dark" logo variant is the dark-colored mark meant for light backgrounds, and
    // vice versa - so the right variant is the *opposite* of the site's own theme.
    // Default to "dark" (i.e. assume a light site theme) until mounted, since
    // resolvedTheme isn't known during server rendering.
    const siteIsDark = mounted && resolvedTheme === "dark";
    const logoTheme = theme ?? (siteIsDark ? "light" : "dark");

    const imagePath = `/logo/logo-${logoTheme}${bg ? "" : "-no-bg"}.svg`;

    const image = (
        <Image
            src={imagePath}
            // Decorative when paired with a visible wordmark in the caller's own link
            // (disableLink) - the link's accessible name comes from that text instead,
            // so screen readers don't announce "IOE Drive Logo" and "IOE Drive" back to back.
            alt={disableLink ? "" : "IOE Drive Logo"}
            preload={true}
            width={size * 16}
            height={size * 16}
        />
    );

    if (disableLink) return image;

    return (
        <Link href={isSignedIn ? "/dashboard" : "/"}>
            {image}
        </Link>
    )
}
