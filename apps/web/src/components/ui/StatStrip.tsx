import Link from "next/link";

import { cn } from "@/utils/cn";

export interface StatStripItem {
    href: string;
    label: string;
    value: number | undefined;
}

interface StatStripProps {
    items: StatStripItem[];
    /**
     * "boxed" (default): a single bordered box divided into equal segments - used
     * instead of separate stat cards so a row of small numbers doesn't read as several
     * mostly-empty boxes.
     * "inline": a lighter, borderless row separated by hairline dividers, for sitting
     * directly next to other text (e.g. beside the dashboard's welcome heading).
     */
    variant?: "boxed" | "inline";
    className?: string;
}

/**
 * Shared between the dashboard hero and the library hub.
 */
const StatStrip = ({ items, variant = "boxed", className }: StatStripProps) => {
    if (variant === "inline") {
        return (
            <div className={cn("flex divide-x divide-border", className)}>
                {items.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="px-4 first:pl-0 last:pr-0 text-center sm:text-left rounded-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <p className="font-display text-[11px] uppercase tracking-wide text-foreground-secondary">{item.label}</p>
                        <p className="text-xl font-bold text-foreground leading-tight mt-1">{item.value ?? "–"}</p>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col sm:flex-row border border-border rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-border overflow-hidden", className)}>
            {items.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="flex-1 px-5 py-4 text-center sm:text-left transition-colors hover:bg-background-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                    <p className="text-2xl font-bold text-foreground leading-none">{item.value ?? "–"}</p>
                    <p className="font-display text-[11px] uppercase tracking-wide text-foreground-secondary mt-1.5">{item.label}</p>
                </Link>
            ))}
        </div>
    );
};

export default StatStrip;
