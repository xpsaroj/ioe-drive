import React from "react";
import Badge, { BadgeProps } from "@/components/ui/Badge";

export interface MimeTypeBadgeProps
    extends Omit<BadgeProps, "children" | "variant" | "color"> {
    mimeType: string;
}

// Color mapping by file type
const mimeColorMap: Record<
    string,
    { bg: string; text: string; border?: string }
> = {
    pdf: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
    },
    png: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    jpg: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    jpeg: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    json: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
    },
    csv: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
    },
    zip: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-200",
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

function getMimeLabel(mimeType: string) {
    if (!mimeType) return "FILE";

    const [, subtype] = mimeType.split("/");

    if (!subtype) return mimeType.toUpperCase();

    if (specialMimeMap[subtype]) {
        return specialMimeMap[subtype];
    }

    return subtype.toUpperCase();
}

function getMimeKey(mimeType: string) {
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