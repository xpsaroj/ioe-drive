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

  if (!isSignedIn) return <Header />

  return (
    <>
      {/* Navbar  */}
      <div className="w-full sticky top-0 z-[60] bg-background/80  border-muted">
        <div
          className={clsx(
            "container mx-auto gap-2 flex items-center justify-between w-full px-4",
            shrink ? "py-1 transition-all duration-300" : "py-3 transition-all duration-300"
          )}
        >
          {/* Logo */}
          <Logo size={6.5} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row md:gap-4 lg:gap-4 rounded-full border border-muted">
            <div className="flex flex-row items-center rounded-full shadow-lg/30">
              {NAVIGATION_ITEMS.map((item, index) => {
                const isCurrentRoute = pathname === item.href
                return (
                  <Link
                    key={item.href + index}
                    href={item.href}
                    className={clsx(
                      "font-semibold text-primary px-4 py-2 lg:px-6 lg:py-4 rounded-full border-muted",
                      isCurrentRoute ? "bg-accent-faded border" : ""
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            {!menuOpen && (
              <button
                className="p-2 rounded-md hover:bg-muted/20 transition-colors duration-200 active:scale-95"
                onClick={() => setMenuOpen(true)}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-foreground" />
              </button>
            )}
          </div>

          {/* Desktop User */}
          <div className="hidden md:block">
            <User />
          </div>
        </div>
      </div>
      {/* Mobile Drawer Menu */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-[70%] bg-background shadow-xl z-[70] transform transition-transform duration-300",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer Header */}
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

        {/* Navigation Items */}
        <div className="flex flex-col px-2 py-4">
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

        {/* Drawer User Section (Mobile Only) */}
        <div className="mt-4 border-t border-muted pt-4 px-4 md:hidden">
          <User />
        </div>
      </div>


      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[65] transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Search bar  */}
      <div className="w-full mb-4">
        <div className="container mx-auto mt-2 w-full flex justify-center items-center pb-2 px-4">
          <SearchBar />
        </div>
      </div>
    </>
  )
}
