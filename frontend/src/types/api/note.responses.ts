import { UserSummary } from "./user.responses";
import { SubjectSummary, SubjectOfferingSummary } from "./subject.responses";

export interface NoteFileSummary {
    id: number;
    noteId: number;
    fileUrl: string;
    originalFileName: string;
    mimeType: string;
}

export interface NoteCard {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;

    offeringId: number;
    uploadedBy?: number;

    subjectOffering: SubjectOfferingSummary & {
        subject: SubjectSummary;
    }

    uploader?: UserSummary;
    files: NoteFileSummary[];
}

export interface RecentNoteItem {
    id: number;
    userId: number;
    noteId: number;
    accessedAt: string;

    note: NoteCard;
}

export interface ArchivedNoteItem {
    id: number;
    userId: number;
    noteId: number;
    archivedAt: string;

    note: NoteCard;
}