"use client";

import { CloudUpload  } from "lucide-react";

const UploadNotes = () => {
  return (
    <div className="w-1/2 bg-white p-4 rounded-xl shadow-sm border border-gray-300">
      <h3 className="text-lg font-semibold mb-4 text-primary text-center">
        Upload Notes
      </h3>
      <div className="flex flex-col items-center text-center">
        <div className="text-yellow-400 mb-3">
          <CloudUpload  className="w-15 h-15 p-1rounded-lg" />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Help fellow students by uploading notes and earn GIGACHAD coins
        </p>
      </div>
    </div>
  );
};

export default UploadNotes;
