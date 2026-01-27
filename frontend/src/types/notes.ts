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