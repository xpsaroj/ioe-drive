"use client"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import clsx from "clsx"
import { useAuth } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"

import { SearchBar } from "@/components/layout"
import Logo from "@/components/Logo"
import { Header } from "@/components/sections/home"
import { User } from "../User"

import { NAVIGATION_ITEMS } from "@/constants/navigations"

/**
 * Navbar component for the application
 */
export default function Navbar() {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()

  const [shrink, setShrink] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShrink(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  // For not logged-in users, show the home page header
  if (!isSignedIn) return <Header />

  return (
    <>
      {/* Navbar (Desktop) */}
      <div className={clsx(
        shrink ? "" : "",
        "hidden md:block w-full sticky top-0 z-50 bg-background/10 backdrop-blur-sm transition-all duration-400")}>
        <div
          className={clsx(
            "container mx-auto flex items-center w-full md:gap-4 transition-all duration-400 ",
            shrink ? "py-0 transform scale-70 justify-center" : "justify-between md:pt-2"
          )}
        >
          {/* Logo */}
          {!shrink && <Logo size={6.5} />}

          {/* Desktop Navigation */}
          <div className="flex flex-row gap-4 rounded-full border border-muted">
            <div className="flex flex-row items-center rounded-full shadow-lg/30">
              {NAVIGATION_ITEMS.map((item, index) => {
                const isCurrentRoute = pathname === item.href;

                return (
                  <Link
                    key={item.href + index}
                    href={item.href}
                    className={clsx(
                      "font-semibold text-primary px-5 py-3 lg:px-6 lg:py-4 rounded-full border",
                      isCurrentRoute ? "bg-accent-faded border-muted" : "border-transparent"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {!shrink && <User />}

        </div>
      </div>

      {/* Search bar  */}
      <div className="hidden md:block w-full mb-4">
        <div className="container mx-auto mt-2 w-full flex justify-center items-center pb-2">
          <SearchBar />
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      <div className="block md:hidden sticky top-0">
        <div className="flex justify-between items-center px-6 py-1 z-50 bg-background/10 backdrop-blur-sm border-b border-muted">
          <div>
            <Logo size={3} />
          </div>

          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md hover:bg-muted/20 transition-colors duration-200 active:scale-95"
              onClick={() => setMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
        <div
          className={clsx(
            "fixed top-0 left-0 h-full w-[70%] flex flex-col bg-background shadow-xl z-70 transform transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-muted">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Menu
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 rounded hover:bg-muted/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col px-2 py-4">
            {NAVIGATION_ITEMS.map((item, index) => {
              const isCurrentRoute = pathname === item.href
              return (
                <Link
                  key={item.href + index}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    "font-medium py-3 px-4 rounded-lg transition-all duration-200",
                    "hover:bg-muted/30 active:scale-95",
                    isCurrentRoute ? "bg-accent-faded text-accent-foreground shadow-md" : "text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
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
    </>
  )
}