import Link from "next/link";

import { cn } from "@/utils/cn";

export interface StatStripItem {
    href: string;
    label: string;
    value: number | undefined;
}

interface StatStripProps {
    items: StatStripItem[];
    className?: string;
}

/**
 * A single bordered box divided into equal, independently-clickable stat segments -
 * used instead of separate stat cards so a row of small numbers doesn't read as several
 * mostly-empty boxes. Shared between the dashboard hero and the library hub.
 */
const StatStrip = ({ items, className }: StatStripProps) => (
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

export default StatStrip;
