
import Link from "next/link";
import { programs } from "@/constants/resources";

const ResourcesPage =() => {
  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary text-center">Select Program</h1>
      <div className="grid mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Link
            key={program.code}
            href={`/resources/${program.code}`}
            className="flex items-center justify-center h-18 sm:h-24 bg-accent-faded text-primary font-semibold rounded-lg shadow-md hover:bg-accent transition-colors"
          >
            {program.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
