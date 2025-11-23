"use client"
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";

import { SearchBar } from "@/components/layout";
import Logo from "@/components/Logo";
import { Header } from "@/components/sections/home";
import { User } from "../User";

import { NAVIGATION_ITEMS } from "@/constants/navigations";

/**
 * Navbar component for the application
 */
export default function Navbar() {
    const pathname = usePathname();

    const [shrink, setShrink] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShrink(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // For not logged-in users, show the home page header
    if (pathname === "/") {
        return <Header />;
    }

    return (
        <>
            {/* Navigations */}
            <div 
                className="w-full sticky top-0 z-50 bg-background/10 backdrop-blur-sm"
            >
                <div
                    className={clsx(
                        "container mx-auto flex items-center justify-between w-full",
                        shrink ? "py-0 transform scale-70 transition-all duration-400" : "py-2 transition-all duration-400"
                    )}
                >
                    <Logo size={6.5} />

                    <div className="flex flex-row gap-4 rounded-full border border-muted">
                        <div className="flex flex-row items-center rounded-full shadow-lg/30">
                            {NAVIGATION_ITEMS.map((item, index) => {
                                const isCurrentRoute = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href + index}
                                        href={item.href}
                                        className={clsx(
                                            "font-semibold text-primary px-6 py-4 rounded-full border-muted",
                                            isCurrentRoute ? "bg-accent-faded border" : ""
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <User />
                </div>
            </div>

            {/* Search */}
            <div className="w-full">
                <div className="container mx-auto mt-2 w-full flex justify-center items-center pb-2">
                    <SearchBar />
                </div>
            </div>
        </>
    );
}