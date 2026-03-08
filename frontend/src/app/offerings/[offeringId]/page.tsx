"use client"
import { useRouter } from "next/navigation";
import { use } from "react"
import { ArrowLeft } from "lucide-react"

import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useSubjectDetails } from "@/hooks/queries/use-academics";
import { SubjectOfferingDetails } from "@/components/common/offering";

interface OfferingPageProps {
    params: Promise<{ offeringId: string }>
}

const OfferingPage = ({
    params
}: OfferingPageProps) => {
    const router = useRouter();
    const { offeringId } = use(params)
    const { data: offering, isLoading, error } = useSubjectDetails(Number(offeringId));

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <Loader text="Loading offering details. Please wait." />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-red-500">Something went wrong. Please try again later.</p>
                    <div className="flex space-x-4">
                        <Button variant="secondary" className="mt-4" onClick={() => router.refresh()}>
                            Refresh Page
                        </Button>
                        <Button variant="primary" className="mt-4" onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (!offering) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center justify-center">
                    <p className="underline">Oops! The subject offering you are looking for does not exist.</p>
                    <Button variant="primary" className="mt-4" onClick={() => router.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto space-y-3">
            <Button
                variant="secondary"
                onClick={() => router.back()}
                icon={<ArrowLeft className="size-4" />}
            >
                Go Back
            </Button>
            <SubjectOfferingDetails offering={offering} />
        </div>
    )
}

export default OfferingPage;