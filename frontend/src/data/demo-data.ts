
export const users = [
  {
    id: 1,
    clerkUserId: "123e4567-e89b-12d3-a456-426614174000",
    fullName: "John Doe",
    email: "john@example.com",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-01",
  },
  {
    id: 2,
    clerkUserId: "123e4567-e89b-12d3-a456-426614174001",
    fullName: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2025-12-02",
    updatedAt: "2025-12-02",
  },
];

export const departments = [
  { id: 1, code: "BCT", name: "Bachelor of Computer Technology" },
  { id: 2, code: "BEX", name: "Bachelor of Electronics" },
];

export const subjects = [
  { id: 1, code: "CS101", name: "Data Structures", departmentId: 1, createdAt: "2025-12-01", updatedAt: "2025-12-01" },
  { id: 2, code: "CS102", name: "Algorithms", departmentId: 1, createdAt: "2025-12-01", updatedAt: "2025-12-01" },
];

export const notes = [
  {
    id: 1,
    title: "Data Structures Notes",
    description: "Stacks, Queues, Linked List...",
    subjectId: 1,
    uploadedBy: 1,
    createdAt: "2025-12-01",
    updatedAt: "2025-12-01",
  },
  {
    id: 2,
    title: "Algorithms Notes",
    description: "Sorting, Searching, Graphs...",
    subjectId: 2,
    uploadedBy: 2,
    createdAt: "2025-12-02",
    updatedAt: "2025-12-02",
  },
];

export const noteFiles = [
  { id: 1, noteId: 1, fileUrl: "/notes/ds.pdf", fileSize: 1024, compressedSize: 512, compressionMethod: "zip", fileType: "pdf", uploadedAt: "2025-12-01" },
  { id: 2, noteId: 2, fileUrl: "/notes/algo.pdf", fileSize: 2048, compressedSize: 1024, compressionMethod: "zip", fileType: "pdf", uploadedAt: "2025-12-02" },
];

export const userRecentNotes = [
  { noteId: 1, noteTitle: "Data Structures Notes", uploader: "John Doe", accessedAt: new Date().toISOString() },
  { noteId: 2, noteTitle: "Algorithms Notes", uploader: "Jane Smith", accessedAt: new Date().toISOString() },
];

export const userArchivedNotes = [
  // empty for now
];

export const semesterDataByUser = [
  { subject: "Data Structures", examType: "BOTH", marks: "100+50", remarks: "Good" },
  { subject: "Algorithms", examType: "BOTH", marks: "100+50", remarks: "Excellent" },
];

export const upcomingExamsByUser = [
  { date: "2082/02/03", subject: "Instrumentation", type: "Assessment (SST)", marks: "20", addedBy: "Acchividhu Aryal" },
  { date: "2082/02/06", subject: "Instrumentation", type: "Board Exam", marks: "60", addedBy: "Acchividhu Aryal" },
];
