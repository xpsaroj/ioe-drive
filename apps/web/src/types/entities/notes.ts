import type { User } from "./user";
import type { Subject, SubjectOffering } from "./academics";

export interface Note {
    id: number;
    title: string;
    description: string;
    offeringId: number;
    uploadedBy?: number;
    createdAt: string;
    updatedAt: string;
}

export interface NoteFile {
    id: number;
    noteId: number;
    originalFileName: string;
    blobName: string;
    mimeType: string;
    fileUrl: string;
    fileSize: number;
    compressedSize: number | null;
    compressionMethod: string | null;
    uploadedAt: string;
}

export interface NoteWithFiles extends Note {
    files: NoteFile[];
}

export interface UploadedNote extends Note {
    subjectOffering: SubjectOffering & {
        subject: Subject;
    }

    uploader?: Omit<User, "email" | "clerkUserId">;
    files: NoteFile[];
}

export interface RecentNote {
    id: number;
    userId: number;
    noteId: number;
    accessedAt: string;
    note: UploadedNote;
}

export interface ArchivedNote {
    id: number;
    userId: number;
    noteId: number;
    archivedAt: string;
    note: UploadedNote;
}
