import { SubjectOfferingWithSubject, SubjectHardnessLevel } from "@/types/academics"

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
    departmentId: 1,
    year: 2024,
    subject: {
      id: 101,
      code: "CSE101",
      name: "Introduction to Programming",
      departmentId: 1,
      hardnessLevel: SubjectHardnessLevel.EASY,
      description: "Basics of programming using C",
      department: {
        id: 1,
        code: "CSE",
        name: "Computer Science and Engineering",
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
    departmentId: 1,
    year: 2024,
    subject: {
      id: 102,
      code: "CSE201",
      name: "Data Structures",
      departmentId: 1,
      hardnessLevel: SubjectHardnessLevel.MEDIUM,
      description: "Arrays, linked lists, stacks, queues, trees",
      department: {
        id: 1,
        code: "CSE",
        name: "Computer Science and Engineering",
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
    departmentId: 2,
    year: 2024,
    subject: {
      id: 201,
      code: "EEE301",
      name: "Circuit Theory",
      departmentId: 2,
      hardnessLevel: SubjectHardnessLevel.HARD,
      description: "Network theorems and AC/DC circuits",
      department: {
        id: 2,
        code: "EEE",
        name: "Electrical and Electronic Engineering",
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
    departmentId: 1,
    year: 2025,
    subject: {
      id: 103,
      code: "CSE401",
      name: "Operating Systems",
      departmentId: 1,
      hardnessLevel: SubjectHardnessLevel.VERY_HARD,
      description: "Processes, threads, memory management",
      department: {
        id: 1,
        code: "CSE",
        name: "Computer Science and Engineering",
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