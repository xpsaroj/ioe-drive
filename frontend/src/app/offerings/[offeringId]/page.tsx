import { use } from "react"

import { SubjectOfferingWithSubject } from "@/types/academics";
import { subjectOfferings } from "@/data/demo-data";

interface OfferingPageProps {
    params: Promise<{ offeringId: string }>
}

const OfferingPage = ({
    params
}: OfferingPageProps) => {
    const { offeringId } = use(params)
    const offering = subjectOfferings.find(o => String(o.id) === offeringId);
    console.log(offering)

    if (!offering) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <p className="underline">Oops! The subject offering you are looking for does not exist.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{offering.subject.name}</h1>
            <p className="text-lg mb-2">Program: {offering.program.name}</p>
            <p className="text-lg mb-2">Semester: {offering.semester}</p>
            <p className="text-lg mb-2">Year: {offering.year}</p>
        </div>
    )
}

export default OfferingPage;