export type NoteFile = {
  id: number;
  noteId: number;
  fileUrl: string;
  fileSize: number;
  compressedSize: number;
  compressionMethod: string;
  fileType: string;
  uploadedAt: string;
};

export type Note = {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  uploadedBy: number;
  files: NoteFile[];
  createdAt: string;
  updatedAt: string;
};

export type SemesterRow = {
  subject: string;
  examType: string;
  marks: string;
  remarks: string;
};

export type UpcomingExam = {
  subject: string;
  date: string;
  type: string;
  marks:string;
  addedBy:string;
};

export type ArchivedNote = {
  noteId: number;
  noteTitle: string;
  subject: string;
  fileType: string;
  remarks: string;
};

export type RecentNote = {
  noteId: number;
  noteTitle: string;
  uploader: string;
  accessedAt: string;
};
