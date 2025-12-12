"use client";

import { useUser } from "@/context/UserContext";
import { Folder } from "lucide-react";

const YourArchive = () => {
  const { archivedNotes } = useUser();

  return (
    <div className="w-1/2 h-56 bg-white p-4 rounded-xl shadow-sm border border-gray-300">
      <h3 className="text-lg text-center font-semibold mb-4 text-primary">Your Archive</h3>
      <div className="flex flex-col items-center text-center">
        <div className="text-purple-600 mb-3">
          <Folder className="w-15 h-15 p-1 bg-purple-100 rounded-lg" />
        </div>
        {archivedNotes.length > 0 ? (
           <p className="text-xs text-gray-500 mt-2">Access all your pinned and favourite notes on the go</p>
        ) : (
          <p className="text-xs text-gray-500 mt-2">No archived notes yet</p>
        )}
      </div>
    </div>
  );
};

export default YourArchive;
