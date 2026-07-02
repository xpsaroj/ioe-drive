"use client"
import { useAuth } from "@clerk/nextjs";
import { useMe } from "@/hooks/queries/use-me";
import Loader from "@/components/ui/Loader";
import { ResourcesHub } from "@/components/sections/resources";

const ResourcesPage = () => {
  const { isSignedIn } = useAuth();
  const { /* data: userData,  */isPending: userPending } = useMe();

  if (userPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          <Loader text="Loading. Please wait." />
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-foreground">You&apos;re not signed in.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
      <ResourcesHub />
    </div>
  );
};

export default ResourcesPage;
