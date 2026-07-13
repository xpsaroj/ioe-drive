"use client";
import { motion } from "motion/react";

import { cn } from "@/utils/cn";

export interface ScatteredTile {
    code: string;
    top: string;
    left: string;
    rotate: number;
    /** Tailwind size + text-size classes, e.g. "size-12 text-sm". */
    size: string;
    solid?: boolean;
    /** Keeps gently bobbing after it settles in, instead of staying still. Use on a
     * few tiles per page, not all of them, or it stops reading as ambient motion. */
    float?: boolean;
}

interface ScatteredCodeTilesProps {
    tiles: ScatteredTile[];
    className?: string;
}

/**
 * Ambient background texture of program/subject-code tiles - the same catalog
 * vocabulary SubjectCodeTile uses inline elsewhere in the app (see resource cards),
 * scattered here as decoration on "moment" pages (auth, onboarding, 404, dashboard
 * welcome). Meant to sit behind real content inside a `relative overflow-hidden`
 * container, not as a standalone element.
 */
const ScatteredCodeTiles = ({ tiles, className }: ScatteredCodeTilesProps) => (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
        {tiles.map((tile, index) => {
            // Varying each floating tile's duration/delay keeps them from bobbing in
            // unison, which would read as one mechanical pulse rather than ambient
            // drift.
            const floatDuration = 3.2 + (index % 3) * 0.7;

            return (
                <motion.span
                    key={tile.code}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: tile.float ? [0, -6, 0] : 0 }}
                    transition={{
                        opacity: { duration: 0.5, ease: "easeOut", delay: index * 0.07 },
                        y: tile.float
                            ? { duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: index * 0.07 }
                            : { duration: 0.5, ease: "easeOut", delay: index * 0.07 },
                    }}
                    style={{ top: tile.top, left: tile.left, rotate: tile.rotate }}
                    className={cn(
                        "absolute flex shrink-0 items-center justify-center rounded-lg font-display font-semibold",
                        tile.size,
                        tile.solid
                            ? "bg-accent text-accent-foreground"
                            : "border border-border text-foreground-tertiary",
                    )}
                >
                    {tile.code}
                </motion.span>
            );
        })}
    </div>
);

export default ScatteredCodeTiles;
