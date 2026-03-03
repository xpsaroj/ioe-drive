import { SubjectOfferingWithSubject, SubjectHardnessLevel } from "@/types/academics"
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


export const subjectOfferings: SubjectOfferingWithSubject[] = [
  {
    id: 1,
    subjectId: 101,
    semester: "1",
    programId: 1,
    year: "1",
    program: {
      id: 1,
      code: "CSE",
      name: "Computer Science and Engineering",
      totalYears: 4,
      syllabusUrl: "https://example.com/syllabus/cse",
    },
    subject: {
      id: 101,
      code: "CSE101",
      name: "Introduction to Programming",
      programId: 1,
      hardnessLevel: SubjectHardnessLevel.EASY,
      description: "Basics of programming using C",
      program: {
        id: 1,
        code: "CSE",
        name: "Computer Science and Engineering",
        totalYears: 4,
        syllabusUrl: "https://example.com/syllabus/cse",
      },
      marks: {
        id: 1,
        subjectId: 101,
        theoryAssessment: 30,
        theoryFinal: 50,
        practicalAssessment: 10,
        practicalFinal: 20,
      }
    },
  },
  {
    id: 2,
    subjectId: 102,
    semester: "2",
    programId: 1,
    year: "1",
    program: {
      id: 1,
      code: "CSE",
      name: "Computer Science and Engineering",
      totalYears: 4,
      syllabusUrl: "https://example.com/syllabus/cse",
    },
    subject: {
      id: 102,
      code: "CSE201",
      name: "Data Structures",
      programId: 1,
      hardnessLevel: SubjectHardnessLevel.MEDIUM,
      description: "Arrays, linked lists, stacks, queues, trees",
      program: {
        id: 1,
        code: "CSE",
        name: "Computer Science and Engineering",
        totalYears: 4,
        syllabusUrl: "https://example.com/syllabus/cse",
      },
      marks: {
        id: 1,
        subjectId: 102,
        theoryAssessment: 40,
        theoryFinal: 60,
        practicalAssessment: 20,
        practicalFinal: 30,
      }
    },
  },
  {
    id: 3,
    subjectId: 201,
    semester: "3",
    programId: 2,
    year: "2",
    program: {
      id: 2,
      code: "EEE",
      name: "Electrical and Electronic Engineering",
      totalYears: 4,
      syllabusUrl: "https://example.com/syllabus/eee",
    },
    subject: {
      id: 201,
      code: "EEE301",
      name: "Circuit Theory",
      programId: 2,
      hardnessLevel: SubjectHardnessLevel.HARD,
      description: "Network theorems and AC/DC circuits",
      program: {
        id: 2,
        code: "EEE",
        name: "Electrical and Electronic Engineering",
        totalYears: 4,
        syllabusUrl: "https://example.com/syllabus/eee",
      },
      marks: {
        id: 1,
        subjectId: 201,
        theoryAssessment: 35,
        theoryFinal: 55,
        practicalAssessment: 15,
        practicalFinal: 25,
      }
    },
  },
  {
    id: 4,
    subjectId: 103,
    semester: "4",
    programId: 1,
    year: "2",
    program: {
      id: 1,
      code: "CSE",
      name: "Computer Science and Engineering",
      totalYears: 4,
      syllabusUrl: "https://example.com/syllabus/cse",
    },
    subject: {
      id: 103,
      code: "CSE401",
      name: "Operating Systems",
      programId: 1,
      hardnessLevel: SubjectHardnessLevel.VERY_HARD,
      description: "Processes, threads, memory management",
      program: {
        id: 1,
        code: "CSE",
        name: "Computer Science and Engineering",
        totalYears: 4,
        syllabusUrl: "https://example.com/syllabus/cse",
      },
      marks: {
        id: 1,
        subjectId: 103,
        theoryAssessment: 45,
        theoryFinal: 70,
        practicalAssessment: 25,
        practicalFinal: 35,
      }
    },
  },
];

export const recentNotes: RecentNote[] = [
  {
    id: 1,
    userId: 101,
    noteId: 5001,
    accessedAt: "2026-02-25T14:32:00Z",
    note: {
      id: 5001,
      title: "OS – Process Scheduling",
      description: "CPU scheduling algorithms and examples",
      subjectId: 301,
      createdAt: "2026-02-20T10:15:00Z",
      updatedAt: "2026-02-20T10:15:00Z",
      subject: {
        id: 301,
        code: "CS301",
        name: "Operating Systems",
        programId: 10,
        hardnessLevel: SubjectHardnessLevel.HARD,
        program: {
          id: 10,
          code: "CSE",
          name: "Computer Science & Engineering",
          totalYears: 4,
        },
        marks: {
          id: 901,
          subjectId: 301,
          theoryAssessment: 30,
          theoryFinal: 70,
          practicalAssessment: 25,
          practicalFinal: 50,
        },
      },
      uploader: {
        id: 201,
        fullName: "Aarav Sharma",
      },
    },
  },
  {
    id: 2,
    userId: 101,
    noteId: 5002,
    accessedAt: "2026-02-24T18:10:00Z",
    note: {
      id: 5002,
      title: "DBMS – Normalization",
      description: "1NF to BCNF with examples",
      subjectId: 302,
      createdAt: "2026-02-18T09:00:00Z",
      updatedAt: "2026-02-19T11:45:00Z",
      subject: {
        id: 302,
        code: "CS302",
        name: "Database Management Systems",
        programId: 10,
        hardnessLevel: SubjectHardnessLevel.MEDIUM,
        program: {
          id: 10,
          code: "CSE",
          name: "Computer Science & Engineering",
          totalYears: 4,
          syllabusUrl: "https://example.com/syllabus/cse",
        },
        marks: {
          id: 902,
          subjectId: 302,
          theoryAssessment: 25,
          theoryFinal: 75,
          practicalAssessment: 30,
          practicalFinal: 50,
        },
      },
      uploader: {
        id: 202,
        fullName: "Neha Verma",
      },
    },
  },
  {
    id: 3,
    userId: 101,
    noteId: 5003,
    accessedAt: "2026-02-23T21:40:00Z",
    note: {
      id: 5003,
      title: "CN – TCP/IP Model",
      description: "Layered architecture and protocols",
      subjectId: 303,
      createdAt: "2026-02-15T14:20:00Z",
      updatedAt: "2026-02-16T10:00:00Z",
      subject: {
        id: 303,
        code: "CS303",
        name: "Computer Networks",
        programId: 10,
        hardnessLevel: SubjectHardnessLevel.MEDIUM,
        program: {
          id: 10,
          code: "CSE",
          name: "Computer Science & Engineering",
          totalYears: 4,
          syllabusUrl: "https://example.com/syllabus/cse",
        },
        marks: {
          id: 903,
          subjectId: 303,
          theoryAssessment: 28,
          theoryFinal: 72,
          practicalAssessment: 20,
          practicalFinal: 50,
        },
      },
      uploader: {
        id: 203,
        fullName: "Rohit Mehta",
      },
    },
  },
  {
    id: 4,
    userId: 101,
    noteId: 5004,
    accessedAt: "2026-02-22T16:05:00Z",
    note: {
      id: 5004,
      title: "SE – Software Development Life Cycle",
      description: "SDLC models and comparisons",
      subjectId: 304,
      createdAt: "2026-02-12T08:30:00Z",
      updatedAt: "2026-02-12T08:30:00Z",
      subject: {
        id: 304,
        code: "CS304",
        name: "Software Engineering",
        programId: 10,
        hardnessLevel: SubjectHardnessLevel.EASY,
        program: {
          id: 10,
          code: "CSE",
          name: "Computer Science & Engineering",
          totalYears: 4,
          syllabusUrl: "https://example.com/syllabus/cse",
        },
        marks: {
          id: 904,
          subjectId: 304,
          theoryAssessment: 35,
          theoryFinal: 65,
          practicalAssessment: 30,
          practicalFinal: 50,
        },
      },
      uploader: {
        id: 204,
        fullName: "Simran Kaur",
      },
    },
  },
  {
    id: 5,
    userId: 101,
    noteId: 5005,
    accessedAt: "2026-02-21T11:55:00Z",
    note: {
      id: 5005,
      title: "TOC – Finite Automata",
      description: "DFA, NFA, and state transitions",
      subjectId: 305,
      createdAt: "2026-02-10T13:10:00Z",
      updatedAt: "2026-02-11T09:00:00Z",
      subject: {
        id: 305,
        code: "CS305",
        name: "Theory of Computation",
        programId: 10,
        hardnessLevel: SubjectHardnessLevel.VERY_HARD,
        program: {
          id: 10,
          code: "CSE",
          name: "Computer Science & Engineering",
          totalYears: 4,
          syllabusUrl: "https://example.com/syllabus/cse",
        },
        marks: {
          id: 905,
          subjectId: 305,
          theoryAssessment: 20,
          theoryFinal: 80,
          practicalAssessment: 0,
          practicalFinal: 0,
        },
      },
      uploader: {
        id: 205,
        fullName: "Kunal Singh",
      },
    },
  },
];