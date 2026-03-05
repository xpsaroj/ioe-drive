"use client"
import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"

import { academicsApi } from "@/lib/api/academics-api";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { SubjectOffering } from "@/components/common/offering";
import type { SubjectOfferingWithSubject } from "@/types";

interface OfferingPageProps {
    params: Promise<{ offeringId: string }>
}

const OfferingPage = ({
    params
}: OfferingPageProps) => {
    const router = useRouter();
    const { offeringId } = use(params)

    const [loading, setLoading] = useState(true);
    const [offering, setOffering] = useState<SubjectOfferingWithSubject | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffering = async () => {
            const offeringIdNum = Number(offeringId);
            if (isNaN(offeringIdNum)) {
                setError("Invalid offering ID.");
                setLoading(false);
                return;
            }

            try {
                const result = await academicsApi.getSubjectDetails(offeringIdNum);
                if (result.success) {
                    setOffering(result.data);
                    setError(null);
                } else {
                    setError("Subject offering not found.");
                }
            } catch (err) {
                setError("Failed to fetch subject offering. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        if (offeringId) {
            fetchOffering();
        }
    }, [offeringId])


    if (loading) {
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
                    <Button variant="primary" className="mt-4" onClick={() => router.back()}>
                        Go Back
                    </Button>
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
                variant="ghost"
                onClick={() => router.back()}
                icon={<ArrowLeft className="size-4" />}
            >
                Go Back
            </Button>
            <SubjectOffering offering={offering} />
        </div>
    )
}

export default OfferingPage;