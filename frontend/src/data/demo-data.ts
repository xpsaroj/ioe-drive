

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
    { id: 1, userId: 1, noteId: 2, accessedAt: "2025-12-05" },
    { id: 2, userId: 2, noteId: 1, accessedAt: "2025-12-06" },
  ];
  
  export const userArchivedNotes = [
    { id: 1, userId: 1, noteId: 1, archivedAt: "2025-12-07" },
  ];
  



export const recentNotesByUser = {
  1: [
    { noteId: 2, noteTitle: "Algorithms Notes", uploader: "Jane Smith" },
    { noteId: 1, noteTitle: "Data Structures Notes", uploader: "John Doe" },
  ],
  2: [
    { noteId: 1, noteTitle: "Data Structures Notes", uploader: "John Doe" },
  ],
};

export const semesterDataByUser = {
  1: [
    { subject: "Data Structures", examType: "Midterm", marks: 85, remarks: "Good" },
    { subject: "Algorithms", examType: "Final", marks: 90, remarks: "Excellent" },
  ],
  2: [
    { subject: "Data Structures", examType: "Midterm", marks: 78, remarks: "Average" },
  ],
};

export const archivedByUser = {
  1: [
    { noteTitle: "Old Data Structures", uploadedBy: "John Doe" },
  ],
  2: [],
};

export const upcomingExamsByUser = {
  1: [
    { subject: "Networks", date: "2025-12-15", type: "Final" },
  ],
};
