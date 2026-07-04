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
}

export default function Logo({
    theme,
    size = 6,
    bg = true,
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

    return (
        <Link href={isSignedIn ? "/dashboard" : "/"}>
            <Image
                src={imagePath}
                alt="IOE Drive Logo"
                preload={true}
                width={size * 16}
                height={size * 16}
            />
        </Link>
    )
}
