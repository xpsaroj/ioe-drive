import type { RootState } from "../../store";

export const selectMyProfile = (state: RootState) => state.me.profile;
export const selectUploadedNotes = (state: RootState) => state.me.uploadedNotes;
export const selectMeLoading = (state: RootState) => state.me.isLoading;