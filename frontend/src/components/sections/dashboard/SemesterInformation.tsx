"use client";
import Link from "next/link";
import { ContainerBox } from "@/components/ui/ContainerBox";
import Table, { Column } from "@/components/ui/Table";
import { SubjectOfferingWithSubject } from "@/types/academics";

import { useAppSelector } from "@/lib/store/hooks";
import { selectSubjectOfferings } from "@/lib/store/features/academics/academics.selectors";

const SemesterInformation = () => {

  const subjectOfferings = useAppSelector(selectSubjectOfferings);

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
        <Link href={`/offerings/${item.id}`}>
          <span className="font-medium cursor-pointer hover:underline">
            {item.subject.name}
          </span>
        </Link>
      ),
    },
    {
      key: "program",
      label: "PROGRAM",
      render: (item) => (
        <span>
          {item.subject.program.code}
        </span>
      ),
    },
    {
      key: "marks-theory",
      label: "MARKS (TH)",
      render: (item) => (
        <span>
          {item.subject.marks.theoryFinal} + {item.subject.marks.theoryAssessment}
        </span>
      ),
    },
    {
      key: "marks-practical",
      label: "MARKS (PR)",
      render: (item) => (
        <span>
          {item.subject.marks.practicalFinal} + {item.subject.marks.practicalAssessment}
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
        loading={subjectOfferings.loading}
        data={subjectOfferings.data}
        emptyMessage="No semester information available. Make sure you've added your semester and program in your profile settings."
        striped
      />
    </ContainerBox>
  );
};

export default SemesterInformation;
