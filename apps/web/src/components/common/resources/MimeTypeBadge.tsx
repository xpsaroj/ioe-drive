import React from "react";
import Badge, { BadgeProps } from "@/components/ui/Badge";

export interface MimeTypeBadgeProps
    extends Omit<BadgeProps, "children" | "variant" | "color"> {
    mimeType: string;
}

const mimeColorMap: Record<
    string,
    { bg: string; text: string; border?: string }
> = {
    pdf: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
    },
    png: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
    },
    jpg: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
    },
    jpeg: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
    },
    json: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
    },
    csv: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
    },
    zip: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
    },
};

const specialMimeMap: Record<string, string> = {
    "vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
    "msword": "DOC",
    "vnd.ms-excel": "XLS",
    "vnd.ms-powerpoint": "PPT",
};

export function getMimeLabel(mimeType: string) {
    if (!mimeType) return "FILE";

    const [, subtype] = mimeType.split("/");

    if (!subtype) return mimeType.toUpperCase();

    if (specialMimeMap[subtype]) {
        return specialMimeMap[subtype];
    }

    return subtype.toUpperCase();
}

export function getMimeKey(mimeType: string) {
    const [, subtype] = mimeType.split("/");
    return subtype?.split(".").pop()?.toLowerCase() || "file";
}

const MimeTypeBadge: React.FC<MimeTypeBadgeProps> = ({
    mimeType,
    ...props
}) => {
    const label = getMimeLabel(mimeType);
    const key = getMimeKey(mimeType);
    const color = mimeColorMap[key];

    return (
        <Badge size="sm" color={color} {...props}>
            {label}
        </Badge>
    );
};

export default MimeTypeBadge;