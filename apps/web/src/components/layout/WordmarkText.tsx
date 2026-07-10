import { cn } from "@/utils/cn";

interface WordmarkTextProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

const sizeStyles: Record<NonNullable<WordmarkTextProps["size"]>, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg sm:text-2xl",
};

/**
 * The "IOE Drive" text half of the logo lockup, set in the display/technical face
 * (see --font-display) - pair with <Logo disableLink /> inside a single Link so the
 * icon and text share one click target. Presentational only; not a link itself.
 */
const WordmarkText = ({ size = "md", className }: WordmarkTextProps) => {
    return (
        <span className={cn("font-display tracking-tight select-none whitespace-nowrap", sizeStyles[size], className)}>
            <span className="font-semibold">IOE</span>
            <span className="font-medium text-foreground-secondary ml-1">Drive</span>
        </span>
    );
};

export default WordmarkText;
