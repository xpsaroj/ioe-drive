import { SubjectHardnessLevel } from "@/types/academics"
import { RecentNote } from "@/types/notes";

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
  { noteId: 3, noteTitle: "Electromagnetism Notes", uploader: "Jane Smith", accessedAt: new Date().toISOString() },
];

export const userArchivedNotes = [
  {
    noteId: 1,
    noteTitle: "Data Communications Notes",
    subject: "Data Communication",
    fileType: "PDF",
    remarks: "Pages 6–37 are important",
  },
  {
    noteId: 2,
    noteTitle: "Instrumentation Insights",
    subject: "Instrumentation",
    fileType: "Insight",
    remarks: "Well explained diagrams",
  },
  {
    noteId: 3,
    noteTitle: "Electromagnetics Book",
    subject: "EM",
    fileType: "Book",
    remarks: "Focus on chapter 3 and 4",
  },
  {
    noteId: 4,
    noteTitle: "Question Bank – Electrodynamics",
    subject: "Electrodynamics",
    fileType: "PDF",
    remarks: "Practice all solved examples",
  },
];


export const semesterDataByUser = [
  { subject: "Data Structures", examType: "BOTH", marks: "100+50", remarks: "Good" },
  { subject: "Algorithms", examType: "BOTH", marks: "100+50", remarks: "Excellent" },
];

export const upcomingExamsByUser = [
  { date: "2082/02/03", subject: "Instrumentation", type: "Assessment (SST)", marks: "20", addedBy: "Acchividhu Aryal" },
  { date: "2082/02/06", subject: "Instrumentation", type: "Board Exam", marks: "60", addedBy: "Acchividhu Aryal" },
];

export const recentNotes: RecentNote[] = [
  {
    id: 1,
    userId: 101,
    noteId: 1001,
    accessedAt: "2026-05-10T08:30:00Z",

    note: {
      id: 1001,
      title: "DSA Complete Notes",
      description: "Stacks, queues, trees and graph algorithms.",
      offeringId: 201,
      uploadedBy: 11,
      createdAt: "2026-05-01T09:00:00Z",
      updatedAt: "2026-05-03T12:00:00Z",

      subjectOffering: {
        id: 201,
        subjectId: 301,
        semester: "3",
        year: "2",
        programId: 1,
        isElective: false,

        subject: {
          id: 301,
          code: "CSC202",
          name: "Data Structures and Algorithms",
          programId: 1,
          hardnessLevel: SubjectHardnessLevel.HARD,
          description: "Core DSA concepts",
          syllabusUrl: "https://example.com/dsa"
        }
      },

      uploader: {
        id: 11,
        fullName: "Sujan Karki"
      },

      files: [
        {
          id: 5001,
          noteId: 1001,
          originalFileName: "dsa-notes.pdf",
          blobName: "notes/dsa-notes.pdf",
          mimeType: "application/pdf",
          fileUrl: "https://cdn.example.com/dsa-notes.pdf",
          fileSize: 2450000,
          compressedSize: 1800000,
          compressionMethod: "gzip",
          uploadedAt: "2026-05-01T09:10:00Z"
        }
      ]
    }
  },

  {
    id: 2,
    userId: 101,
    noteId: 1002,
    accessedAt: "2026-05-09T14:15:00Z",

    note: {
      id: 1002,
      title: "Computer Networks Notes",
      description: "OSI model and TCP/IP.",
      offeringId: 202,
      uploadedBy: 12,
      createdAt: "2026-04-28T10:00:00Z",
      updatedAt: "2026-04-29T11:20:00Z",

      subjectOffering: {
        id: 202,
        subjectId: 302,
        semester: "4",
        year: "2",
        programId: 1,
        isElective: false,

        subject: {
          id: 302,
          code: "CSC301",
          name: "Computer Networks",
          programId: 1,
          hardnessLevel: SubjectHardnessLevel.MEDIUM,
          description: "Network models and protocols"
        }
      },

      uploader: {
        id: 12,
        fullName: "Aashish Sharma"
      },

      files: [
        {
          id: 5002,
          noteId: 1002,
          originalFileName: "computer-networks.pdf",
          blobName: "notes/computer-networks.pdf",
          mimeType: "application/pdf",
          fileUrl: "https://cdn.example.com/computer-networks.pdf",
          fileSize: 1980000,
          compressedSize: null,
          compressionMethod: null,
          uploadedAt: "2026-04-28T10:10:00Z"
        }
      ]
    }
  },

  {
    id: 3,
    userId: 101,
    noteId: 1003,
    accessedAt: "2026-05-08T17:45:00Z",

    note: {
      id: 1003,
      title: "Operating System Deadlocks",
      description: "Deadlock prevention and avoidance.",
      offeringId: 203,
      uploadedBy: 13,
      createdAt: "2026-04-20T08:30:00Z",
      updatedAt: "2026-04-22T09:15:00Z",

      subjectOffering: {
        id: 203,
        subjectId: 303,
        semester: "4",
        year: "2",
        programId: 1,
        isElective: false,

        subject: {
          id: 303,
          code: "CSC302",
          name: "Operating System",
          programId: 1,
          hardnessLevel: SubjectHardnessLevel.VERY_HARD,
          description: "Processes and memory management"
        }
      },

      uploader: {
        id: 13,
        fullName: "Nischal Thapa"
      },

      files: [
        {
          id: 5003,
          noteId: 1003,
          originalFileName: "os-deadlocks.pdf",
          blobName: "notes/os-deadlocks.pdf",
          mimeType: "application/pdf",
          fileUrl: "https://cdn.example.com/os-deadlocks.pdf",
          fileSize: 2200000,
          compressedSize: 1600000,
          compressionMethod: "zip",
          uploadedAt: "2026-04-20T08:45:00Z"
        }
      ]
    }
  },

  {
    id: 4,
    userId: 101,
    noteId: 1004,
    accessedAt: "2026-05-07T13:10:00Z",

    note: {
      id: 1004,
      title: "DBMS Normalization Guide",
      description: "1NF to BCNF with examples.",
      offeringId: 204,
      uploadedBy: 14,
      createdAt: "2026-04-18T11:00:00Z",
      updatedAt: "2026-04-18T12:00:00Z",

      subjectOffering: {
        id: 204,
        subjectId: 304,
        semester: "3",
        year: "2",
        programId: 1,
        isElective: false,

        subject: {
          id: 304,
          code: "CSC303",
          name: "Database Management System",
          programId: 1,
          hardnessLevel: SubjectHardnessLevel.MEDIUM
        }
      },

      uploader: {
        id: 14,
        fullName: "Prerana Joshi"
      },

      files: [
        {
          id: 5004,
          noteId: 1004,
          originalFileName: "dbms-normalization.pdf",
          blobName: "notes/dbms-normalization.pdf",
          mimeType: "application/pdf",
          fileUrl: "https://cdn.example.com/dbms-normalization.pdf",
          fileSize: 1700000,
          compressedSize: 1200000,
          compressionMethod: "gzip",
          uploadedAt: "2026-04-18T11:10:00Z"
        }
      ]
    }
  },

  {
    id: 5,
    userId: 101,
    noteId: 1005,
    accessedAt: "2026-05-06T19:25:00Z",

    note: {
      id: 1005,
      title: "Software Engineering Agile Notes",
      description: "Agile, Scrum and SDLC models.",
      offeringId: 205,
      uploadedBy: 15,
      createdAt: "2026-04-10T14:00:00Z",
      updatedAt: "2026-04-11T09:30:00Z",

      subjectOffering: {
        id: 205,
        subjectId: 305,
        semester: "5",
        year: "3",
        programId: 1,
        isElective: true,

        subject: {
          id: 305,
          code: "CSC404",
          name: "Software Engineering",
          programId: 1,
          hardnessLevel: SubjectHardnessLevel.EASY,
          syllabusUrl: "https://example.com/se"
        }
      },

      uploader: {
        id: 15,
        fullName: "Ritika Lama"
      },

      files: [
        {
          id: 5005,
          noteId: 1005,
          originalFileName: "software-engineering.pdf",
          blobName: "notes/software-engineering.pdf",
          mimeType: "application/pdf",
          fileUrl: "https://cdn.example.com/software-engineering.pdf",
          fileSize: 1500000,
          compressedSize: null,
          compressionMethod: null,
          uploadedAt: "2026-04-10T14:15:00Z"
        }
      ]
    }
  }
];