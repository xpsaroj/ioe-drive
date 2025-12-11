"use client";

import { useUser } from "@/context/UserContext";

const RecentAccessItem = ({ title, author }: { title: string; author: string }) => (
  <div className="border border-muted rounded-lg p-3 cursor-pointer hover:bg-blue-50 transition duration-150">

    <h4
      className="text-lg font-semibold text-link border-b border-link overflow-hidden whitespace-nowrap text-ellipsis"
      title={title} 
    >
      {title}
    </h4>
    <p className="text-xs text-black/65"> | By {author}</p>
  </div>
);


const RecentAccess = () => {
  const { recentNotes } = useUser();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Access</h3>
      <div className="space-y-3">
        {recentNotes.map((note) => (
          <RecentAccessItem
            key={note.noteId}
            title={note.noteTitle}
            author={note.uploader}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentAccess;
