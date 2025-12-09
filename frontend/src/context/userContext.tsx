
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RecentNote, ArchivedNote, SemesterRow, UpcomingExam } from "@/types/main";

export type UserContextType = {
  recentNotes: RecentNote[];
  archivedNotes: ArchivedNote[];
  semesterData: SemesterRow[];
  upcomingExams: UpcomingExam[];
  setUpcomingExams: (exams: UpcomingExam[]) => void;
  addRecentNote: (note: RecentNote) => void;
  archiveNote: (note: ArchivedNote) => void;

};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {

  // Dummy initial data per user
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([
    { noteId: 1, noteTitle: "Data Structures Notes", uploader: "John Doe", accessedAt: new Date().toISOString() },
    { noteId: 2, noteTitle: "Algorithms Notes", uploader: "Jane Smith", accessedAt: new Date().toISOString() },
  ]);

  const [archivedNotes, setArchivedNotes] = useState<ArchivedNote[]>([]);
  const [semesterData, setSemesterData] = useState<SemesterRow[]>([
    { subject: "Data Structures", examType: "Midterm", marks: 85, remarks: "Good" },
    { subject: "Algorithms", examType: "Final", marks: 90, remarks: "Excellent" },
  ]);

  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([
    { date: "2082/02/03", subject: "Instrumentation", type: "Assessment (SST)", marks: "20", addedBy: "Acchividhu Aryal" },
    { date: "2082/02/06", subject: "Instrumentation", type: "Board Exam", marks: "60", addedBy: "Acchividhu Aryal" },
  ]);


  // Actions
  const addRecentNote = (note: RecentNote) => {
    setRecentNotes((prev) => [...prev, note]);
  };

  const archiveNote = (note: ArchivedNote) => {
    setArchivedNotes((prev) => [...prev, note]);
  };



  return (
    <UserContext.Provider
      value={{
        recentNotes,
        archivedNotes,
        semesterData,

        upcomingExams,
        setUpcomingExams,
        addRecentNote,
        archiveNote,

      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};
