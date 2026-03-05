import type { UserProfile, UploadedNote, RecentNote, ArchivedNote, AsyncState } from "@/types";

export interface MeState {
    profile: AsyncState<UserProfile | null>;
    uploadedNotes: AsyncState<UploadedNote[]>;
    recentNotes: AsyncState<RecentNote[]>;
    archivedNotes: AsyncState<ArchivedNote[]>;
}