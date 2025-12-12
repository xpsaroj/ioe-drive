"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { RecentNote, ArchivedNote, SemesterRow, UpcomingExam } from "@/types/main";
import {
  userRecentNotes,
  userArchivedNotes,
  semesterDataByUser,
  upcomingExamsByUser,
} from "@/data/demo-data";

export type UserContextType = {
  recentNotes: RecentNote[];
  archivedNotes: ArchivedNote[];
  semesterData: SemesterRow[];
  upcomingExams: UpcomingExam[];
  addRecentNote: (note: RecentNote) => void;
  archiveNote: (note: ArchivedNote) => void;
  addExam: (exam: UpcomingExam) => void;
  updateExam: (index: number, updatedExam: UpcomingExam) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {

  // Load data from localStorage or fallback to demo-data
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>(() => {
    const stored = localStorage.getItem("recentNotes");
    return stored ? JSON.parse(stored) : userRecentNotes;
  });

  const [archivedNotes, setArchivedNotes] = useState<ArchivedNote[]>(() => {
    const stored = localStorage.getItem("archivedNotes");
    return stored ? JSON.parse(stored) : userArchivedNotes;
  });

  const [semesterData, setSemesterData] = useState<SemesterRow[]>(() => {
    const stored = localStorage.getItem("semesterData");
    return stored ? JSON.parse(stored) : semesterDataByUser;
  });

  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>(() => {
    const stored = localStorage.getItem("upcomingExams");
    return stored ? JSON.parse(stored) : upcomingExamsByUser;
  });

  // Persist all changes to localStorage for now (as no backend is present)
  useEffect(() => {
    localStorage.setItem("recentNotes", JSON.stringify(recentNotes));
  }, [recentNotes]);

  useEffect(() => {
    localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));
  }, [archivedNotes]);

  useEffect(() => {
    localStorage.setItem("semesterData", JSON.stringify(semesterData));
  }, [semesterData]);

  useEffect(() => {
    localStorage.setItem("upcomingExams", JSON.stringify(upcomingExams));
  }, [upcomingExams]);

  // Actions
  const addRecentNote = (note: RecentNote) => setRecentNotes(prev => [...prev, note]);
  const archiveNote = (note: ArchivedNote) => setArchivedNotes(prev => [...prev, note]);
  const addExam = (exam: UpcomingExam) => setUpcomingExams(prev => [...prev, exam]);
  const updateExam = (index: number, updatedExam: UpcomingExam) =>
    setUpcomingExams(prev => prev.map((e, i) => (i === index ? updatedExam : e)));

  return (
    <UserContext.Provider
      value={{
        recentNotes,
        archivedNotes,
        semesterData,
        upcomingExams,
        addRecentNote,
        archiveNote,
        addExam,
        updateExam,
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
