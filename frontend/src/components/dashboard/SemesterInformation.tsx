
"use client";

import { useUser } from "@/context/userContext";

const SemesterInformation = () => {
  const { semesterData } = useUser();

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-800">
        Semester Information
      </h3>
      <p className="text-xs text-gray-500 mb-4 italic">
        Tip: Click on subject to directly access its resources
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-xs font-medium text-white bg-[#2f2a2a] uppercase tracking-wider">
              <th className="px-3 py-2 text-left">SUBJECT</th>
              <th className="px-3 py-2 text-left">EXAM TYPE</th>
              <th className="px-3 py-2 text-left">MARKS</th>
              <th className="px-3 py-2 text-left">REMARKS</th>
            </tr>
          </thead>
          <tbody className="">
            {semesterData.map((item, index) => (
              <tr key={index} className="text-sm odd:bg-[#BAA2D3] even:bg-accent-faded text-[#3d0562]">
                <td className="px-3 py-2 whitespace-nowrap font-medium  cursor-pointer hover:underline">
                  {item.subject}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{item.examType}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.marks}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right text-sm text-blue-600 cursor-pointer hover:underline">
        View All &gt;&gt;
      </div>
    </div>
  );
};

export default SemesterInformation;
