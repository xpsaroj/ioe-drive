"use client";

import React, { useState, useEffect } from "react";
import { Search, LayoutGrid } from "lucide-react";

export default function SearchBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
    
    return (
        <div className="search-bar">
            <div className="flex items-center border border-muted rounded-full px-1 py-1">
                <Search className="ml-2 w-5 h-5 text-muted" />
                <input
                    type="text"
                    placeholder={isMobile ? "Search anything..." : "Type to search for everything...."}
                    className="mx-2 min-w-4xs md:min-w-3xs bg-transparent outline-none grow text-foreground placeholder:text-primary"
                />
                <div className="bg-accent-faded flex flex-row items-center justify-center gap-1 px-3 py-2.5 rounded-full cursor-pointer">
                    <LayoutGrid className="size-4 text-primary" />
                    <span className="text-primary text-xs">+ Space</span>
                </div>
            </div>
        </div>
    );
}