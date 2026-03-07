import { SubjectOfferingWithSubject } from "@/types"
import Select from "@/components/ui/Select"

interface SubjectTabsProps {
    subjects: SubjectOfferingWithSubject[];
    onSubjectSelect?: (subject: SubjectOfferingWithSubject) => void;
}

const SubjectTabs = ({
    subjects,
    onSubjectSelect,
}: SubjectTabsProps) => {
    return (
        <div className="flex w-full md:w-1/2 pb-2">
            <Select
                label="Subject"
                helperText="Select a subject to view its available resources."
                onChange={(e) => {
                    const selectedSubject = subjects.find((s) => String(s.id) === e.target.value);
                    if (selectedSubject && onSubjectSelect) {
                        onSubjectSelect(selectedSubject);
                    }
                }}
                options={subjects.map(subject => ({
                    value: String(subject.id),
                    label: `${subject.subject.code} - ${subject.subject.name}`
                }))}
            />
        </div>
    )
}

export default SubjectTabs;