import React from "react";
import Badge, { BadgeProps } from "@/components/ui/Badge";
import { SubjectHardnessLevel } from "@/types/entities";

const hardnessColorMap: Record<
    SubjectHardnessLevel,
    { bg: string; text: string; border?: string }
> = {
    [SubjectHardnessLevel.EASY]: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
    },
    [SubjectHardnessLevel.MEDIUM]: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
    },
    [SubjectHardnessLevel.HARD]: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
    },
    [SubjectHardnessLevel.VERY_HARD]: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
    },
};

export interface SubjectHardnessBadgeProps
    extends Omit<BadgeProps, "children" | "variant" | "color"> {
    level: SubjectHardnessLevel;
}

const SubjectHardnessBadge: React.FC<SubjectHardnessBadgeProps> = ({
    level,
    ...props
}) => {
    const color = hardnessColorMap[level];

    return (
        <Badge color={color} {...props}>
            {level}
        </Badge>
    );
};

export default SubjectHardnessBadge;