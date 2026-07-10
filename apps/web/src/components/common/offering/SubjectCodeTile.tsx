import { cn } from "@/utils/cn";

interface SubjectCodeTileProps {
    code: string;
    /** `sm` for compact inline rows (e.g. a resource card's footer); `md` for a
     * standalone subject block (e.g. the resource detail page's "Related Subject"
     * card). */
    size?: "sm" | "md";
    className?: string;
}

const sizeClasses = {
    sm: "size-6 rounded-md text-[9px]",
    md: "size-10 rounded-lg text-sm",
};

/** The colored subject-initials square used wherever a subject/offering is referenced
 * compactly - keeps that visual language (and the exact two-letter truncation) in one
 * place instead of duplicated inline at each call site. */
const SubjectCodeTile = ({ code, size = "sm", className }: SubjectCodeTileProps) => (
    <span
        className={cn(
            sizeClasses[size],
            "flex shrink-0 items-center justify-center bg-accent font-display font-semibold text-accent-foreground",
            className,
        )}
    >
        {code.slice(0, 2)}
    </span>
);

export default SubjectCodeTile;
