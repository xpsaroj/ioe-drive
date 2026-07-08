"use client";
import { useAuth } from "@clerk/nextjs"
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Toaster } from "sonner";

import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { Header } from "../sections/home";
import Footer from "./Footer";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isSignedIn } = useAuth()
    const pathname = usePathname()
    // sonner's Toaster defaults to a light theme when no `theme` prop is passed, which
    // is why toasts stayed white in dark mode. "system" is a safe fallback before the
    // real theme is known (matches what we'd render server-side anyway), and sonner
    // resolves it internally without needing our own mounted-guard.
    const { resolvedTheme } = useTheme();
    const toasterTheme = (resolvedTheme as "light" | "dark") ?? "system";

    const pagesWithFooter = ["/", "/about", "/contact"]

    // For not logged-in users, show the home page header
    if (!isSignedIn) return (
        <div className="flex-col min-h-screen">
            <Header />
            <div className="flex-1">
                {children}
            </div>
            <Toaster richColors position="top-right" theme={toasterTheme} />
            {pagesWithFooter.includes(pathname) && (
                <Footer />
            )}
        </div>
    )

    return (
        <div className="flex md:flex-row flex-col min-h-screen">
            {/* z-20: `sticky` always opens its own stacking context, regardless of
                z-index - without an explicit one here, this whole block (including
                Navbar's own z-30 collapse toggle) would paint *behind* any page content
                that also happens to use `sticky` (e.g. a page's sticky breadcrumb bar),
                since that page content sits later in the DOM as an equally
                context-less-at-this-level sibling. This ensures the navbar - and its
                toggle - always wins regardless of what a page does internally. */}
            <div className="hidden md:block sticky top-0 h-screen border-r z-20">
                <Navbar />
            </div>
            <div className="md:hidden">
                <MobileNav />
            </div>
            <Toaster richColors position="top-right" theme={toasterTheme} />
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