import type { User } from "./user";
import type { SubjectWithDepartment } from "./academics";

export interface Note {
    id: number;
    title: string;
    description: string;
    subjectId: number;
    uploadedBy?: number;
    createdAt: string;
    updatedAt: string;
}

export interface NoteFile {
    id: number;
    noteId: number;
    fileUrl: string;
    fileSize: number;
    compressedSize: number;
    compressionMethod: string;
    fileType: string;
    uploadedAt: string;
}

export interface UploadedNote extends Note {
    subject: SubjectWithDepartment;
    uploader?: Omit<User, "email" | "clerkUserId">;
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