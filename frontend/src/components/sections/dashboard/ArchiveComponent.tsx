"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, PencilLine, Check, AlertCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface Editing {
  id: number;
  remark: string;
}

const DeleteConfirmModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[1px] z-50">
    <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-2xl w-80 text-center">
      <div className="flex justify-center mb-3">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <p className="text-lg font-medium text-primary mb-6">
        Are you sure you want to delete this item?
      </p>
      <div className="flex justify-between gap-4">
        <button
          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
          onClick={onConfirm}
        >
          Yes, Delete
        </button>
        <button
          className="flex-1 px-4 py-2 bg-gray-200 text-primary font-semibold rounded-lg shadow hover:bg-gray-300 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const ArchiveComponent: React.FC = () => {
  const router = useRouter();
  const { archivedNotes } = useUser();

  const [notes, setNotes] = useState(archivedNotes);
  const [filter, setFilter] = useState<string | null>(null);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  const handleBackToDashboard = () => router.push("/dashboard");

  const handleDeleteClick = (id: number) => {
    setNoteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete !== null) {
      setNotes((prev) => prev.filter((note) => note.noteId !== noteToDelete));
      setShowDeleteConfirm(false);
      setNoteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setNoteToDelete(null);
  };

  const handleFilter = (type: string) => setFilter((prev) => (prev === type ? null : type));

  const handleEdit = (id: number, remark: string) => {
    setEditing({ id, remark });
  };

  const handleSave = (id: number) => {
    if (!editing) return;
    setNotes((prev) =>
      prev.map((note) =>
        note.noteId === id ? { ...note, remarks: editing.remark } : note
      )
    );
    setEditing(null);
  };

  const filteredNotes = useMemo(
    () => (filter ? notes.filter((n) => n.fileType === filter) : notes),
    [notes, filter]
  );

  return (
    <div className="p-5">
      <div className="relative mx-auto pt-8 px-4 pb-12 bg-white rounded-xl shadow-sm border border-gray-300 w-full max-w-6xl flex flex-col">
        {/* Header */}
        <h3 className="text-2xl font-semibold text-primary">Your Archive</h3>
        <p className="text-xs text-muted mb-4 italic">
          Tip: Click on delete icon to remove from archive, click file type to filter (and click again to unfilter), edit remarks inline.
        </p>

        {/* Table */}
        <div className="overflow-x-auto mt-5">
          <table className="min-w-[700px] md:min-w-full table-auto">
            <thead>
              <tr className="text-xs font-medium text-white bg-[#2f2a2a] uppercase tracking-wider">
                <th className="px-3 py-2 text-left">RESOURCE NAME</th>
                <th className="px-3 py-2 text-left">SUBJECT</th>
                <th className="px-3 py-2 text-left">FILE TYPE</th>
                <th className="px-3 py-2 text-left">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((item) => (
                  <tr
                    key={item.noteId}
                    className="text-sm odd:bg-[#BAA2D3] even:bg-accent-faded text-[#3d0562]"
                  >
                    <td className="px-3 py-2 font-medium flex items-center justify-between cursor-pointer whitespace-nowrap">
                      <span className="underline decoration-2 font-bold hover:decoration-link">
                        {item.noteTitle}
                      </span>
                      <Trash2
                        className="w-4 h-4 text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => handleDeleteClick(item.noteId)}
                      />
                    </td>
                    <td className="px-3 py-2">{item.subject}</td>
                    <td className="px-3 py-2">
                      <span
                        onClick={() => handleFilter(item.fileType)}
                        className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                          item.fileType === "PDF"
                            ? "bg-red-100 text-red-700"
                            : item.fileType === "Book"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        } ${filter === item.fileType ? "ring-2 ring-purple-500" : ""}`}
                      >
                        {item.fileType}
                      </span>
                    </td>
                    <td className="px-3 py-2 italic flex items-center gap-2">
                      {editing?.id === item.noteId ? (
                        <>
                          <input
                            type="text"
                            value={editing.remark}
                            onChange={(e) =>
                              setEditing((prev) =>
                                prev ? { ...prev, remark: e.target.value } : null
                              )
                            }
                            className="border px-1 py-0.5 rounded text-sm w-full"
                          />
                          <Check
                            className="w-4 h-4 text-green-600 cursor-pointer"
                            onClick={() => handleSave(item.noteId)}
                          />
                        </>
                      ) : (
                        <>
                          <span>{item.remarks || "—"}</span>
                          <PencilLine
                            className="w-4 h-4 text-purple-600 cursor-pointer"
                            onClick={() => handleEdit(item.noteId, item.remarks || "")}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted">
                    No archived resources found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        {/* Back Button */}
        <button
          onClick={handleBackToDashboard}
          className="absolute text-sm sm:text-md -bottom-4 left-1/2 transform -translate-x-1/2 p-2 sm:px-6 py-2 bg-white border border-purple-600 text-purple-700 font-medium rounded-lg hover:bg-accent-faded transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 inline-block mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ArchiveComponent;
