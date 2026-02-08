import type { UserProfile, UploadedNote, RecentNote, ArchivedNote } from "@/types";

export interface MeState {
    profile: UserProfile | null;
    uploadedNotes: UploadedNote[];
    recentNotes: RecentNote[];
    archivedNotes: ArchivedNote[];
    isLoading: boolean;
    error?: string;
}