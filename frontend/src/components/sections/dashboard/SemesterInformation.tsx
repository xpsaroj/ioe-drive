"use client";
import Table, { Column } from "@/components/ui/Table";
import { SubjectOfferingWithSubject } from "@/types/academics";
import { subjectOfferings } from "@/data/demo-data";

const SemesterInformation = () => {
  const columns: Column<SubjectOfferingWithSubject>[] = [
    {
      key: "code",
      label: "CODE",
      render: (item) => (
        <span className="text-sm text-gray-500">{item.subject.code}</span>
      ),
    },
    {
      key: "subject",
      label: "SUBJECT",
      render: (item) => (
        <span className="font-medium cursor-pointer hover:underline">
          {item.subject.name}
        </span>
      ),
    },
    {
      key: "examType",
      label: "EXAM TYPE",
      render: (item) => (
        <span>
          {item.semester} {item.year}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
      <h3 className="text-lg font-semibold text-gray-800">
        Subjects this semester
      </h3>
      <p className="text-xs text-gray-500 mb-4 italic">
        Tip: Click on subject to directly access its resources
      </p>
      <Table
        columns={columns}
        data={subjectOfferings}
        emptyMessage="No semester information available."
        striped
      />
    </div>
  );
};

export default SemesterInformation;
