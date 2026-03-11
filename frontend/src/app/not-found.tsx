"use client"
import { useAuth } from "@clerk/nextjs";

export default function NotFound() {
    const { isSignedIn } = useAuth();

    return (
        <div className={`${isSignedIn ? "min-h-screen" : "min-h-[calc(100vh-13rem)]"} flex flex-col items-center justify-center bg-background px-6 py-12 text-center`}>
            <h1 className="text-8xl font-bold text-foreground">404</h1>
            <p className="mt-4 text-xl text-foreground-secondary">
                Oops! The page you are looking for does not exist.
            </p>
        </div>
    );
}