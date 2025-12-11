"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { RecentNote, ArchivedNote, SemesterRow, UpcomingExam } from "@/types/main";
import { useUser as useClerkUser } from "@clerk/nextjs";

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
  const { isSignedIn } = useClerkUser();

  // Dummy data
  const dummyRecentNotes: RecentNote[] = [
    { noteId: 1, noteTitle: "Data Structures Notes", uploader: "John Doe", accessedAt: new Date().toISOString() },
    { noteId: 2, noteTitle: "Algorithms Notes", uploader: "Jane Smith", accessedAt: new Date().toISOString() },
  ];
  const dummySemesterData: SemesterRow[] = [
    { subject: "Data Structures", examType: "BOTH", marks: "100+50", remarks: "Good" },
    { subject: "Algorithms", examType: "BOTH", marks: "100+50", remarks: "Excellent" },
  ];
  const dummyUpcomingExams: UpcomingExam[] = [
    { date: "2082/02/03", subject: "Instrumentation", type: "Assessment (SST)", marks: "20", addedBy: "Acchividhu Aryal" },
    { date: "2082/02/06", subject: "Instrumentation", type: "Board Exam", marks: "60", addedBy: "Acchividhu Aryal" },
  ];

  // State 
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>(dummyRecentNotes);
  const [archivedNotes, setArchivedNotes] = useState<ArchivedNote[]>([]);
  const [semesterData, setSemesterData] = useState<SemesterRow[]>(dummySemesterData);
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>(() => {
    try {
      const stored = localStorage.getItem("upcomingExams");
      return stored ? JSON.parse(stored) : dummyUpcomingExams;
    } catch (err) {
      console.error("Failed to parse upcomingExams from localStorage", err);
      return dummyUpcomingExams;
    }
  });

  // Load data from localStorage for non-logged-in users
  useEffect(() => {
    if (!isSignedIn) {
      try {
        const loadData = () => {
          const recentNotesData = localStorage.getItem("recentNotes");
          const archivedNotesData = localStorage.getItem("archivedNotes");
          const semesterDataData = localStorage.getItem("semesterData");
          const upcomingExamsData = localStorage.getItem("upcomingExams");
  
          if (recentNotesData) setRecentNotes(JSON.parse(recentNotesData));
          if (archivedNotesData) setArchivedNotes(JSON.parse(archivedNotesData));
          if (semesterDataData) setSemesterData(JSON.parse(semesterDataData));
          if (upcomingExamsData) setUpcomingExams(JSON.parse(upcomingExamsData));
        };
  
        // Run asynchronously to avoid setState in effect warning
        setTimeout(loadData, 0);
      } catch (err) {
        console.error("Failed to load user data from localStorage", err);
      }
    }
  }, [isSignedIn]);  

  // Persist state to localStorage for non-logged-in users
  useEffect(() => {
    if (!isSignedIn) {
      try {
        localStorage.setItem("recentNotes", JSON.stringify(recentNotes));
        localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));
        localStorage.setItem("semesterData", JSON.stringify(semesterData));
        localStorage.setItem("upcomingExams", JSON.stringify(upcomingExams));
      } catch (err) {
        console.error("Failed to save user data to localStorage", err);
      }
    }
  }, [recentNotes, archivedNotes, semesterData, upcomingExams, isSignedIn]);

  // Actions with error handling
  const addRecentNote = (note: RecentNote) => {
    try {
      setRecentNotes(prev => [...prev, note]);
    } catch (err) {
      console.error("Failed to add recent note", err);
    }
  };

  const archiveNote = (note: ArchivedNote) => {
    try {
      setArchivedNotes(prev => [...prev, note]);
    } catch (err) {
      console.error("Failed to archive note", err);
    }
  };

  const addExam = (exam: UpcomingExam) => {
    try {
      setUpcomingExams(prev => [...prev, exam]);
    } catch (err) {
      console.error("Failed to add exam", err);
    }
  };

  const updateExam = (index: number, updatedExam: UpcomingExam) => {
    try {
      setUpcomingExams(prev => prev.map((e, i) => (i === index ? updatedExam : e)));
    } catch (err) {
      console.error("Failed to update exam", err);
    }
  };

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
