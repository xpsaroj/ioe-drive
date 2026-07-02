"use client";
import { ContainerBox } from "@/components/ui/ContainerBox";
import Table from "@/components/ui/Table";
import { upcomingExamsByUser } from "@/data/demo-data";

interface Exam {
  date: string;
  subject: string;
  type: string;
  marks: string;
  addedBy: string;
}

const UpcomingExams: React.FC = () => {

  return (
    <ContainerBox
      title="Upcoming Exams and Assessments"
      comment="Tip: Click on pencil icon to edit exams. After editing, click save."
    >
      <Table<Exam>
        data={upcomingExamsByUser}
        columns={[
          { key: "date", label: "Date" },
          { key: "subject", label: "Subject" },
          { key: "type", label: "Type" },
          { key: "marks", label: "Marks" },
          { key: "addedBy", label: "Added By" },
        ]}
      />
    </ContainerBox>
  );
};

export default UpcomingExams;
