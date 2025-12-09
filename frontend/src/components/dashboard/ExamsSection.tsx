"use client";

import { useState } from "react";
import { PencilLine, Check, X, Plus } from "lucide-react";
import { useUser } from "@/context/userContext";
import { useClerk } from "@clerk/nextjs";

const UpcomingExams: React.FC = () => {
    const { user } = useClerk();
    const { upcomingExams, setUpcomingExams } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [newExam, setNewExam] = useState({
        date: "",
        subject: "",
        type: "",
        marks: "",
        addedBy: "",
    });

    // Update field of existing exams
    const handleChange = (index: number, field: string, value: any) => {
        const updated = [...upcomingExams];
        updated[index] = { ...updated[index], [field]: value }; //change here
        setUpcomingExams(updated);
    };

    // Add new exam row
    const handleAddRow = () => {
        setUpcomingExams([...upcomingExams, { ...newExam }]);
        setNewExam({ date: "", subject: "", type: "", marks: "", addedBy: "" });
    };

    const formatDate = (dateStr: string) => {
        
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    return (
        <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-start gap-2">
                Upcoming Exams and Assessments
                <span
                    className="ml-2 text-purple-600 cursor-pointer"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? <X className="w-4 h-4" /> : <PencilLine className="w-4 h-4" />}
                </span>
            </h3>
            <p className="text-xs text-gray-500 mb-4 italic">
                Tip: Click on pencil icon to edit exams. After editing, click "Add Row" to add new exams.
            </p>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="text-xs font-medium text-white bg-[#2f2a2a] uppercase tracking-wider">
                            <th className="px-3 py-2 text-left">DATE</th>
                            <th className="px-3 py-2 text-left">SUBJECT</th>
                            <th className="px-3 py-2 text-left">EXAM TYPE</th>
                            <th className="px-3 py-2 text-left">MARKS</th>
                            <th className="px-3 py-2 text-left">ADDED BY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingExams.map((item, index) => (
                            <tr
                                key={index}
                                className="text-sm odd:bg-[#BAA2D3] even:bg-accent-faded text-[#3d0562]"
                            >
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={formatDate(item.date)}
                                            onChange={(e) => handleChange(index, "date", e.target.value)}
                                            className="border rounded px-1 w-full"
                                        />
                                    ) : (
                                        item.date
                                    )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={item.subject}
                                            onChange={(e) => handleChange(index, "subject", e.target.value)}
                                            className="border rounded px-1 w-full"
                                        />
                                    ) : (
                                        item.subject
                                    )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={item.type}
                                            onChange={(e) => handleChange(index, "type", e.target.value)}
                                            className="border rounded px-1 w-full"
                                        />
                                    ) : (
                                        item.type
                                    )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={item.marks}
                                            onChange={(e) => handleChange(index, "marks", e.target.value)}
                                            className="border rounded px-1 w-full"
                                        />
                                    ) : (
                                        item.marks
                                    )}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={user?.fullName || "Unknown"}
                                            onChange={(e) => handleChange(index, "addedBy", e.target.value)}
                                            className="border rounded px-1 w-full"
                                        />
                                    ) : (
                                        item.addedBy
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Row button */}
            {isEditing && (
                <div className="mt-3 flex gap-2 items-center">
                    <button
                        onClick={handleAddRow}
                        className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Add Row
                    </button>
                </div>
            )}
        </div>
    );
};

export default UpcomingExams;
