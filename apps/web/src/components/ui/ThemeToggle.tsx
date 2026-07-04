"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";
import Button from "./Button";

/**
 * Toggles between the light and dark theme. Defaults to the system preference until
 * the user picks one explicitly (next-themes persists the choice to localStorage).
 *
 * Renders a neutral (light-mode) icon until mounted, since the actual resolved theme
 * (system preference vs. a stored choice) isn't known during server rendering.
 */
export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            icon={isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            className=""
        />
    );
}
