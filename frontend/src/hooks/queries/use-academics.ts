import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { academicsApi } from "@/lib/api/academics-api";
import type { Semester, Year } from "@/types";

export const academicsKeys = {
    all: ["academics"] as const,
    programs: ["academics", "programs"] as const,
    subjectOfferings: (programId?: number, semester?: Semester) => [...academicsKeys.all, "subject-offerings", programId, semester] as const,
    subjectDetails: (offeringId: number) => [...academicsKeys.all, "subject-details", offeringId] as const,
    subjectsForUpload: (programId?: number, year?: Year, semester?: Semester) => [...academicsKeys.all, "subjects-for-upload", programId, year, semester] as const,
};

export function useSubjectOfferings(programId?: number, semester?: Semester) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: academicsKeys.subjectOfferings(programId, semester),
        queryFn: async () => {
            if (!programId || !semester) {
                throw new Error("Program ID and semester are required");
            }
            const response = await academicsApi.getSubjectsByProgramAndSemester({ programId, semester })
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch subject offerings");
            }
            return response.data;
        },
        enabled: isSignedIn && !!programId && !!semester,
        staleTime: 20 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

export function usePrograms() {
    return useQuery({
        queryKey: academicsKeys.programs,
        queryFn: async () => {
            const response = await academicsApi.getAllPrograms();
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch programs");
            }
            return response.data;
        },
        staleTime: Infinity,    // Cache indefinitely since programs do not change
        gcTime: Infinity,
    });
}

export function useSubjectDetails(offeringId: number) {
    return useQuery({
        queryKey: academicsKeys.subjectDetails(offeringId),
        queryFn: async () => {
            const response = await academicsApi.getSubjectDetails(offeringId);
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch subject details");
            }
            return response.data;
        },
        enabled: !!offeringId,
        staleTime: 2 * 60 * 1000,
        gcTime: 3 * 60 * 1000,
    });
}

export function useSubjectsForUpload(programId?: number, year?: Year, semester?: Semester) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: academicsKeys.subjectsForUpload(programId, year, semester),
        queryFn: async () => {
            if (!programId || !year || !semester) {
                throw new Error("Program ID, year and semester are required");
            }
            const response = await academicsApi.getSubjectsForUpload({ programId, year, semester });
            if (!response.success) {
                throw new Error(response.error || "Failed to fetch subjects");
            }
            return response.data;
        },
        enabled: !!(isSignedIn && programId && year && semester),
        staleTime: 20 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}