"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="search-bar">
            <button
                type="button"
                className="flex items-center border rounded-md p-2 w-full cursor-pointer"
            >
                <Search className="size-5 text-foreground-secondary" />
                <span className="ml-2 text-sm text-foreground-secondary">Search...</span>
            </button>
        </div>
    );
}