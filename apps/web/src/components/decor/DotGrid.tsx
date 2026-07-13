import { cn } from "@/utils/cn";

interface DotGridProps {
    className?: string;
}

/**
 * A subtle graph-paper/blueprint dot pattern - a different texture from
 * ScatteredCodeTiles for boxes that want ambient detail without another scatter of
 * tiles (which stops reading as a signature once it's everywhere). Uses --color-border
 * so it stays faint and theme-correct without its own opacity tuning per theme. Meant
 * to sit behind real content inside a `relative overflow-hidden` container.
 */
const DotGrid = ({ className }: DotGridProps) => (
    <div
        className={cn("pointer-events-none absolute inset-0", className)}
        style={{
            backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
        }}
    />
);

export default DotGrid;
