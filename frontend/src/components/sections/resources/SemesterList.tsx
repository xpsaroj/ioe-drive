"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

type Programs="bct"|"bce"|"becie";

export default function ResourceComp() {
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1);
  const {department} = useParams<{department:Programs}>();

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl text-center font-bold text-primary mb-6">
        All Semesters
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {semesters.map((sem) => (
          <Link
            key={sem}
            href={`/resources/${department}/${sem}`}
            className="flex items-center justify-center h-18 sm:h-24 bg-accent-faded text-primary font-semibold rounded-lg shadow-md hover:bg-accent transition-colors"
          >
            Semester {sem}
          </Link>
        ))}
      </div>
    </div>
  );
}
