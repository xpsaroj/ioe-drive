"use client";
import { ContainerBox } from "@/components/ui/ContainerBox";
import { recentNotes } from "@/data/demo-data";

const RecentAccessItem = ({ title, author }: { title: string; author: string }) => (
  <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-background-tertiary transition duration-150">
    <p className="overflow-hidden whitespace-nowrap text-ellipsis">{title}</p>
    <p className="text-xs text-black/65"> By {author}</p>
  </div>
);

const RecentAccess = () => {
  return (
    <ContainerBox
      title="Recently accessed notes"
      comment="Jump back to your notes and continue where you left off."
      className="md:min-w-xs flex-1"
    >
      <div className="space-y-3">
        {recentNotes.slice(0, 2).map((noteItem) => (
          <RecentAccessItem
            key={noteItem.noteId}
            title={noteItem.note.title}
            author={noteItem.note.uploader?.fullName || "Unknown"}
          />
        ))}
      </div>
    </ContainerBox>
  );
};

export default RecentAccess;
