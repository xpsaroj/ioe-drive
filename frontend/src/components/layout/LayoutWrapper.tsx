"use client";
import { useAuth } from "@clerk/nextjs"

import Navbar from "./Navbar";
import { Header } from "../sections/home";
import Footer from "./Footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useAuth()

    // For not logged-in users, show the home page header
    if (!isSignedIn) return (
        <div className="flex-col min-h-screen">
            <Header />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )

    return (
        <div className="flex md:flex-row flex-col min-h-screen">
            <div className="hidden md:block sticky top-0 w-64 h-screen border-r border-gray-300">
                <Navbar />
            </div>

            <div className="md:flex-1 flex flex-col min-h-screen">
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default LayoutWrapper