"use client";
import { ContainerBox } from "@/components/ui/ContainerBox";
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
    <ContainerBox
      title="Subjects this semester"
      comment="Tip: Click on subject to directly access its resources"
    >
      <Table
        columns={columns}
        data={subjectOfferings}
        emptyMessage="No semester information available."
        striped
      />
    </ContainerBox>
  );
};

export default SemesterInformation;
