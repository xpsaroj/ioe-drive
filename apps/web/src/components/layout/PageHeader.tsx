import { cn } from "@/utils/cn";

import Breadcrumbs, { type BreadcrumbItem } from "./Breadcrumbs";

export type { BreadcrumbItem };

interface PageHeaderProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    /** Optional right-aligned content next to the title (e.g. a primary action button). */
    actions?: React.ReactNode;
    className?: string;
}

/**
 * Standard page header: a title with optional actions, and a breadcrumb trail beneath
 * it. The title scrolls away with the page; the breadcrumb sticks to the top of the
 * viewport once it gets there, so there's always a compact way back up the hierarchy
 * while the content below keeps scrolling underneath it.
 *
 * Renders as a fragment (no wrapping element) rather than its own container, since a
 * `position: sticky` element only stays stuck for as long as its parent is on screen -
 * it needs to sit directly in the page's own scrollable container, alongside the
 * content below it, not inside a short wrapper of its own.
 */
const PageHeader = ({ title, breadcrumbs, actions, className }: PageHeaderProps) => {
    return (
        <>
            <div className={cn("flex items-start justify-between gap-4 pb-4", className)}>
                <h1 className="text-xl font-medium text-foreground md:text-2xl">{title}</h1>
                {actions && <div className="shrink-0">{actions}</div>}
            </div>
            <div className="sticky top-0 z-10 mb-6 border-b border-border bg-background/95 py-2.5 backdrop-blur-sm">
                <Breadcrumbs items={breadcrumbs} />
            </div>
        </>
    );
};

export default PageHeader;
