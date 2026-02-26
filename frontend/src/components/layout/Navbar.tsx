"use client"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

import { SearchBar } from "@/components/layout"
import Button from "@/components/ui/Button"
import Logo from "@/components/Logo"
import { User } from "../User"

import { NAVIGATION_ITEMS } from "@/constants/navigations"

/**
 * Navbar component for the application
 */
export default function Navbar() {
  const pathname = usePathname()

  const [showDesktopNav, setShowDesktopNav] = useState(true)

  return (
    <div className="hidden md:block w-auto relative">
      <Button
        variant="ghost"
        size="sm"
        className={`absolute top-2 ${showDesktopNav ? "-right-4" : "-right-10"} hidden p-0 md:flex items-center justify-center backdrop-blur-sm shadow-lg`}
        onClick={() => setShowDesktopNav(!showDesktopNav)}
        icon={showDesktopNav ? <PanelRightOpen className="size-5" /> : <PanelLeftOpen className="size-5" />}
        iconOnly
      />

      <div className={`${showDesktopNav ? "w-64 block" : "hidden"}`}>
        <div className="flex flex-col gap-4 overflow-hidden h-screen">
          <div className="pt-3 px-3 flex flex-col gap-4">
            <div className="px-3 flex flex-row gap-2 items-center">
              <Logo theme="dark" size={2} bg={false} />
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
                    variant={isCurrentRoute ? "secondary" : "ghost"}
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
        </div>

        <div className="border-t border-gray-300 px-3 py-2 hover:bg-muted/30 transition-colors cursor-pointer">
          <User />
        </div>
      </div>
    </div>
  )
}