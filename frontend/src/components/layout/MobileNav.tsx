"use client"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import clsx from "clsx"
import { Menu, X } from "lucide-react"

import { SearchBar } from "@/components/layout"
import Button from "@/components/ui/Button"
import Logo from "@/components/Logo"
import { User } from "../User"

import { NAVIGATION_ITEMS } from "@/constants/navigations"

/**
 * Mobile navigation component for the application
 */
export default function MobileNav() {
    const pathname = usePathname()

    const [menuOpen, setMenuOpen] = useState(false)

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [menuOpen])

    return (
        <div>
            {/* Floating button for mobile nav */}
            <div className="fixed top-3 right-3 md:hidden">
                <button
                    className="p-3 text-foreground backdrop-blur-sm rounded-full shadow-lg transition-colors border border-button-primary"
                    onClick={() => setMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* Sidebar (Mobile) */}
            <div className="block md:hidden sticky top-0 z-50">
                <div
                    className={clsx(
                        "fixed top-0 left-0 h-full w-[70%] flex flex-col gap-4 bg-background shadow-xl z-70 transform transition-transform duration-300",
                        menuOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div>
                            <Logo size={2} theme="dark" />
                        </div>
                        <button
                            onClick={() => setMenuOpen(false)}
                            aria-label="Close menu"
                            className="rounded-full border-none py-2 px-1"
                        >
                            <X className="w-5 h-5 rounded-full" />
                        </button>
                    </div>

                    <div className="px-3">
                        <SearchBar />
                    </div>

                    <div className="h-full px-3 flex flex-col overflow-y-auto">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Navigation
                        </h3>
                        <div className="space-y-1 flex flex-col" role="navigation">
                            {NAVIGATION_ITEMS.map(({ href, icon: Icon, name }, index) => {
                                const isCurrentRoute = pathname === href || pathname.startsWith(href + "/");
                                return (
                                    <div
                                        key={href + index}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Button
                                            href={href}
                                            variant={isCurrentRoute ? "secondary" : "ghost"}
                                            className="border-none w-full justify-start"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Icon className="size-5" />
                                                {name}
                                            </div>
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="my-4 border-t border-muted pt-4 px-4 md:hidden">
                        <User />
                    </div>
                </div>

                {menuOpen && (
                    <div
                        className="fixed inset-0 overflow-hidden bg-black/40 z-65 transition-opacity duration-300"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </div>
        </div>
    )
}