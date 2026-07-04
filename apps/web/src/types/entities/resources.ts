import type { User } from "./user";
import type { Subject, SubjectOffering } from "./academics";

export enum ResourceType {
    NOTE = "NOTE",
    PAST_QUESTION = "PAST_QUESTION",
    ASSESSMENT = "ASSESSMENT",
    LAB_SHEET = "LAB_SHEET",
    BOOK = "BOOK",
    OTHER = "OTHER",
}

export const ResourceTypeLabel: Record<ResourceType, string> = {
    [ResourceType.NOTE]: "Note",
    [ResourceType.PAST_QUESTION]: "Past Question",
    [ResourceType.ASSESSMENT]: "Assessment",
    [ResourceType.LAB_SHEET]: "Lab Sheet",
    [ResourceType.BOOK]: "Book",
    [ResourceType.OTHER]: "Other",
};

export interface Resource {
    id: number;
    title: string;
    description: string;
    type: ResourceType;
    offeringId: number;
    uploadedBy?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ResourceFile {
    id: number;
    resourceId: number;
    originalFileName: string;
    blobName: string;
    mimeType: string;
    fileUrl: string;
    fileSize: number;
    compressedSize: number | null;
    compressionMethod: string | null;
    uploadedAt: string;
}

export interface ResourceWithFiles extends Resource {
    files: ResourceFile[];
}

export interface UploadedResource extends Resource {
    subjectOffering: SubjectOffering & {
        subject: Subject;
    }

    uploader?: Omit<User, "email" | "clerkUserId">;
    files: ResourceFile[];
}

export interface RecentResource {
    id: number;
    userId: number;
    resourceId: number;
    accessedAt: string;
    resource: UploadedResource;
}

export interface BookmarkedResource {
    id: number;
    userId: number;
    resourceId: number;
    bookmarkedAt: string;
    resource: UploadedResource;
}
