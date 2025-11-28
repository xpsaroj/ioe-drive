"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { HeroSection, Features } from "@/components/sections/home";

export default function Home() {
  const router = useRouter();

  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null;
  }

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Line */}
      {/* <HorizontalLine /> */}

      {/* Features Section */}
      <Features />

    </main>
  );
}
