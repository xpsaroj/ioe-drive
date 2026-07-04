import { SubjectHardnessLevel } from "@/types/entities/academics"
import { RecentResource, ResourceType } from "@/types/entities/resources";

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

export const semesterDataByUser = [
  { subject: "Data Structures", examType: "BOTH", marks: "100+50", remarks: "Good" },
  { subject: "Algorithms", examType: "BOTH", marks: "100+50", remarks: "Excellent" },
];

export const upcomingExamsByUser = [
  { date: "2082/02/03", subject: "Instrumentation", type: "Assessment (SST)", marks: "20", addedBy: "Acchividhu Aryal" },
  { date: "2082/02/06", subject: "Instrumentation", type: "Board Exam", marks: "60", addedBy: "Acchividhu Aryal" },
];

export const recentResources: RecentResource[] = [
  {
    id: 1,
    userId: 101,
    resourceId: 1001,
    accessedAt: "2026-05-10T08:30:00Z",

    resource: {
      id: 1001,
      title: "DSA Complete Notes",
      description: "Stacks, queues, trees and graph algorithms.",
      type: ResourceType.NOTE,
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
          resourceId: 1001,
          originalFileName: "dsa-notes.pdf",
          blobName: "resources/dsa-notes.pdf",
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
    resourceId: 1002,
    accessedAt: "2026-05-09T14:15:00Z",

    resource: {
      id: 1002,
      title: "Computer Networks Notes",
      description: "OSI model and TCP/IP.",
      type: ResourceType.NOTE,
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
          resourceId: 1002,
          originalFileName: "computer-networks.pdf",
          blobName: "resources/computer-networks.pdf",
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
    resourceId: 1003,
    accessedAt: "2026-05-08T17:45:00Z",

    resource: {
      id: 1003,
      title: "Operating System Deadlocks",
      description: "Deadlock prevention and avoidance.",
      type: ResourceType.NOTE,
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
          resourceId: 1003,
          originalFileName: "os-deadlocks.pdf",
          blobName: "resources/os-deadlocks.pdf",
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
    resourceId: 1004,
    accessedAt: "2026-05-07T13:10:00Z",

    resource: {
      id: 1004,
      title: "DBMS Normalization Guide",
      description: "1NF to BCNF with examples.",
      type: ResourceType.NOTE,
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
          resourceId: 1004,
          originalFileName: "dbms-normalization.pdf",
          blobName: "resources/dbms-normalization.pdf",
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
    resourceId: 1005,
    accessedAt: "2026-05-06T19:25:00Z",

    resource: {
      id: 1005,
      title: "Software Engineering Agile Notes",
      description: "Agile, Scrum and SDLC models.",
      type: ResourceType.NOTE,
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
          resourceId: 1005,
          originalFileName: "software-engineering.pdf",
          blobName: "resources/software-engineering.pdf",
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
