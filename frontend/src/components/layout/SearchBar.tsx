import { Search, LayoutGrid } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="search-bar">
            <div className="flex items-center border border-muted rounded-full px-1 py-1">
                <Search className="ml-2 w-5 h-5 text-muted" />
                <input
                    type="text"
                    placeholder="Type to search for everything...."
                    className="mx-2 min-w-3xs bg-transparent outline-none grow text-foreground placeholder:text-primary"
                />
                <div className="bg-accent-faded flex flex-row items-center justify-center gap-1 px-3 py-2.5 rounded-full cursor-pointer">
                    <LayoutGrid className="size-4 text-primary" />
                    <span className="text-primary text-xs">+ Space</span>
                </div>
            </div>
        </div>
    );
}