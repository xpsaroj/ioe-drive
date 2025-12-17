"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { departmentSubjects } from "@/constants/resources";

export default function SemesterRedirectPage() {
  const { department, semester } = useParams<{ department: string; semester: string }>();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (!department || !semester) return;

    // Get subjects for this department + semester
    const subjects = departmentSubjects[department]?.[semester] || [];

    if (subjects.length > 0) {
      const defaultSubject = subjects[0].code; // first subject as default
      router.replace(`/resources/${department}/${semester}/${defaultSubject}`);
    } else {
      setIsRedirecting(false); 
    }
  }, [department, semester, router]);

  if (!isRedirecting) {
    return <p className="text-center mt-20 text-gray-500">No subjects found.</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="ml-4 text-primary font-medium">Loading...</p>
    </div>
  );
}
