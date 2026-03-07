"use client"
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
// import { useAuth } from "@clerk/nextjs";

// import { useMe } from "@/hooks/queries/use-me";
// import Select from "@/components/ui/Select";
import { programs } from "@/constants/resources";

const ResourcesPage = () => {
  // const router = useRouter();
  // const { isSignedIn } = useAuth();
  // const { data: userData } = useMe();
  // const profile = userData?.profile;

  // useEffect(() => {
  //   if (isSignedIn && user?.profile?.program) {
  //     router.push(`/resources/${user.profile.program.code.toLowerCase()}`);
  //   }
  // }, [isSignedIn, router])

  return (
    <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
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
