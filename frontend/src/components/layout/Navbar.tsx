"use client"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import clsx from "clsx"
import { useAuth } from "@clerk/nextjs"
import { Menu, X } from "lucide-react"

import { SearchBar } from "@/components/layout"
import Button from "@/components/ui/Button"
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

  // For not logged-in users, show the home page header
  if (!isSignedIn) return <Header />

  return (
    <div className="">
      {/* Sidebar (Desktop) */}
      <div className="flex flex-col gap-4 overflow-hidden h-screen">
        <div className="pt-3 px-3 flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-center">
            <Logo size={2} />
            IOE Drive
          </div>

          <div>
            <SearchBar />
          </div>
        </div>

        <div className="h-full px-3 flex flex-col overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </h3>
          <div className="space-y-1 flex flex-col" role="navigation">
            {NAVIGATION_ITEMS.map(({ href, icon: Icon, name }, index) => {
              const isCurrentRoute = pathname === href || pathname.startsWith(href + "/");
              return (
                <Button
                  key={href + index}
                  href={href}
                  variant={isCurrentRoute ? "secondary": "ghost"}
                  className="border-none w-full justify-start"
                >
                  <div className="flex gap-2 items-center">
                    <Icon className="size-5" />
                    {name}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-300 px-3 py-2 hover:bg-muted/30 transition-colors cursor-pointer">
          <User />
        </div>
      </div>

      {/* Sidebar (Mobile) */}
      <div className="block md:hidden sticky top-0 z-50">
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
              const isCurrentRoute = pathname === item.href || pathname.startsWith(item.href + "/");
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
    </div>
  )
}