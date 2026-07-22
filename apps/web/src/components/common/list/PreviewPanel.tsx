import Link from "next/link";

interface PreviewPanelProps {
    title: string;
    viewAllHref: string;
    tiles: React.ReactNode[];
    emptyText: string;
    /** Grid columns at the sm breakpoint - 2 for the narrower column, 3 for full-width. */
    columns?: 2 | 3;
}

// Generic "title + View all link + a small grid of preview tiles" panel - shared across
// hub-style pages (LibraryHub, a user's profile) that preview a few items from a larger
// list living on its own dedicated page, rather than embedding the full paginated list.
const PreviewPanel = ({ title, viewAllHref, tiles, emptyText, columns = 3 }: PreviewPanelProps) => (
    <div>
        <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <Link href={viewAllHref} className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors shrink-0">
                View all
            </Link>
        </div>

        {tiles.length > 0 ? (
            <div className={columns === 2 ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "grid grid-cols-1 sm:grid-cols-3 gap-4"}>
                {tiles}
            </div>
        ) : (
            <p className="text-sm text-foreground-secondary">{emptyText}</p>
        )}
    </div>
);

export default PreviewPanel;
