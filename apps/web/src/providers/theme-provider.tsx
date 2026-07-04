"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Wraps next-themes' ThemeProvider so the rest of the app imports it from our own
 * providers/ directory rather than reaching into next-themes directly. Manages the
 * `.dark` class on <html> (see the `dark:` custom variant in globals.css) based on
 * system preference or the user's manual choice, persisted to localStorage.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
