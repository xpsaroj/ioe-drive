import React from "react";
import Badge, { BadgeProps } from "@/components/ui/Badge";
import { SubjectHardnessLevel } from "@/types";

const hardnessColorMap: Record<
    SubjectHardnessLevel,
    { bg: string; text: string; border?: string }
> = {
    [SubjectHardnessLevel.EASY]: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
    },
    [SubjectHardnessLevel.MEDIUM]: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
    },
    [SubjectHardnessLevel.HARD]: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-200",
    },
    [SubjectHardnessLevel.VERY_HARD]: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
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