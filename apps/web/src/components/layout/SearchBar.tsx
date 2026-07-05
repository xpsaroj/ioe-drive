"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <button
            type="button"
            className="flex items-center gap-2 border border-border rounded-md px-3 py-2 w-full text-left transition-colors hover:bg-background-hover hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <Search className="size-4 text-foreground-tertiary shrink-0" />
            <span className="text-sm text-foreground-tertiary">Search...</span>
        </button>
    );
}