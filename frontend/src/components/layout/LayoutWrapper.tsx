"use client";
import { useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation";

import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { Header } from "../sections/home";
import Footer from "./Footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useAuth()
    const pathname = usePathname()

    const pagesWithFooter = ["/", "/about", "/contact"]

    // For not logged-in users, show the home page header
    if (!isSignedIn) return (
        <div className="flex-col min-h-screen">
            <Header />
            <div className="flex-1">
                {children}
            </div>
            {pagesWithFooter.includes(pathname) && (
                <Footer />
            )}
        </div>
    )

    return (
        <div className="flex md:flex-row flex-col min-h-screen">
            <div className="hidden md:block sticky top-0 w-64 h-screen border-r border-gray-300">
                <Navbar />
            </div>
            <div className="md:hidden">
                <MobileNav />
            </div>

            <div className="md:flex-1 flex flex-col min-h-screen">
                <div className="flex-1">
                    {children}
                </div>
                {pagesWithFooter.includes(pathname) && (
                    <Footer />
                )}
            </div>
        </div>
    )
}

export default LayoutWrapper