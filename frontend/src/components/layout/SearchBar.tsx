"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="search-bar">
            <button
                type="button"
                className="flex items-center border border-gray-300 rounded-md p-2 w-full cursor-pointer"
            >
                <Search className="size-5 text-gray-300" />
                <span className="ml-2 text-sm text-gray-500">Search...</span>
            </button>
        </div>
    );
}