"use client";

import { CloudUpload } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const UploadNotes = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/dashboard/upload")}
      className="w-1/2 h-56 bg-white p-4 rounded-xl shadow-sm border border-gray-300"
    >
      <h3 className="text-lg font-semibold mb-4 text-primary text-center">
        Upload Notes
      </h3>
      <div className="flex flex-col items-center text-center">
        <div className="text-yellow-400 mb-3">
          <CloudUpload className="w-15 h-15 p-1rounded-lg" />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Help fellow students by uploading notes and earn GIGACHAD coins
        </p>
      </div>
    </div>
  );
};

export default UploadNotes;

// Define the type for the form state
interface UploadForm {
  resourceName: string;
  resourceType: string;
  targetStudents: string;
  college: string;
}

export const UploadComponent: React.FC = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<UploadForm>({
    resourceName: "",
    resourceType: "",
    targetStudents: "",
    college: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // Handle file selection through click
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      console.log("Selected File:", selected);
    }
  };

  // Handle drag-and-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      console.log("Dropped File:", dropped);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: check if any field or file is empty
    if (
      !formState.resourceName.trim() ||
      !formState.resourceType ||
      !formState.targetStudents ||
      !formState.college.trim() ||
      !file
    ) {
      alert("Please fill in all fields and select a file before uploading.");
      return;
    }

    // Simulate upload
    console.log("Uploading Resource:", formState);
    console.log("File:", file);

    // Reset form fields and file
    setFormState({
      resourceName: "",
      resourceType: "",
      targetStudents: "",
      college: "",
    });
    setFile(null);

    // Show success alert
    alert("Resource uploaded successfully!");
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg border-2 border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-primary">Upload Notes</h2>
        <p className="text-sm text-muted italic mb-8">
          Make sure to keep the resource name relevant to the file you are uploading.
        </p>

        {/* File Drop Area */}
        <div
          className="border-2 border-gray-200 p-4 text-center mb-8 rounded-lg cursor-pointer hover:border-purple-400 transition duration-150"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <CloudUpload className="w-12 h-12 text-yellow-500 mx-auto mb-3" />

          {file ? (
            <p className="text-md text-primary">{file.name}</p>
          ) : (
            <p className="text-md text-primary">
              Drag and drop files here or click to add from computer.
            </p>
          )}

          {/* Hidden File Input */}
          <input
            id="fileInput"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SECTION */}
          <div className="w-full lg:w-2/3 flex flex-col space-y-4">
            {/* Resource Name */}
            <div className="flex flex-col space-y-1 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              <label htmlFor="resourceName" className="text-md font-medium text-primary w-40">
                Resource Name:
              </label>
              <input
                type="text"
                name="resourceName"
                id="resourceName"
                value={formState.resourceName}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g. Data Communications"
              />
            </div>

            {/* Resource Type */}
            <div className="flex flex-col space-y-1 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              <label htmlFor="resourceType" className="text-md font-medium text-primary w-40">
                Resource Type:
              </label>
              <select
                name="resourceType"
                id="resourceType"
                value={formState.resourceType}
                onChange={handleChange}
                className="flex-1 px-3 py-2 h-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Resource Type</option>
                {["Notes", "Question Book", "Book"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Students */}
            <div className="flex flex-col space-y-1 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              <label htmlFor="targetStudents" className="text-md font-medium text-primary w-40">
                Target Students:
              </label>
              <select
                name="targetStudents"
                id="targetStudents"
                value={formState.targetStudents}
                onChange={handleChange}
                className="flex-1 px-3 py-2 h-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Semester</option>
                {Array.from({ length: 8 }, (_, i) => `${i + 1}th Semester`).map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* College */}
            <div className="flex flex-col space-y-1 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              <label htmlFor="college" className="text-md font-medium text-primary w-40">
                College:
              </label>
              <input
                type="text"
                name="college"
                id="college"
                value={formState.college}
                onChange={handleChange}
                placeholder="e.g., IOE Pulchowk Campus"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <button
              type="submit"
              className="w-full lg:h-full bg-white rounded-lg border-2 border-yellow-300 transition duration-150 flex flex-col items-center justify-center py-6 space-y-3"
            >
              <span className="font-bold text-2xl text-primary">UPLOAD</span>
              <CloudUpload className="w-10 h-10 text-yellow-500" />
              <p className="text-sm text-muted text-center px-4">
                By submitting, you agree to all terms and conditions of this website.
              </p>
            </button>
          </div>
        </form>

        <div className="relative w-full flex justify-center py-6">
          <button
            className="absolute -bottom-13 text-sm font-medium text-purple-700 px-6 py-2 bg-white rounded-lg border border-purple-600 hover:bg-accent-faded transition"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
