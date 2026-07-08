import { UploaderSummary } from "./user.responses";
import { SubjectSummary, SubjectOfferingSummary } from "./academics.responses";
import { ResourceType } from "../entities";

export interface ResourceFileSummary {
    id: number;
    resourceId: number;
    fileUrl: string;
    fileSize: number;
    originalFileName: string;
    mimeType: string;
}

export interface ResourceSummary {
    id: number;
    title: string;
    description: string;
    type: ResourceType;
    createdAt: string;
    updatedAt: string;

    offeringId: number;
    uploadedBy?: number;

    subjectOffering: SubjectOfferingSummary & {
        subject: SubjectSummary;
    }

    uploader?: UploaderSummary;
    files: ResourceFileSummary[];
}

export interface RecentResourceItem {
    id: number;
    userId: number;
    resourceId: number;
    accessedAt: string;

    resource: ResourceSummary;
}

export interface BookmarkedResourceItem {
    id: number;
    userId: number;
    resourceId: number;
    bookmarkedAt: string;

    resource: ResourceSummary;
}
