import { createSlice } from "@reduxjs/toolkit";
import type { MeState } from "./me.types";
import {
    fetchMyProfile,
    fetchUploadedNotes,
    updateMyProfile,
} from "./me.thunks";
import { createAsyncState } from "../../utils";

const initialState: MeState = {
    profile: createAsyncState(null),
    uploadedNotes: createAsyncState([]),
    recentNotes: createAsyncState([]),
    archivedNotes: createAsyncState([]),
};

export const meSlice = createSlice({
    name: "me",
    initialState,
    reducers: {
        clearMeState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyProfile.pending, (state) => {
                state.profile.loading = true;
                state.profile.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.profile.loading = false;
                state.profile.error = null;
                state.profile.data = action.payload;
            })
            .addCase(fetchMyProfile.rejected, (state) => {
                state.profile.loading = false;
                state.profile.error = "Failed to load profile";
            })
            .addCase(updateMyProfile.pending, (state) => {
                state.profile.loading = true;
                state.profile.error = null;
            })
            .addCase(updateMyProfile.fulfilled, (state) => {
                state.profile.loading = false;
                state.profile.error = null;
            })
            .addCase(updateMyProfile.rejected, (state) => {
                state.profile.loading = false;
                state.profile.error = "Failed to update profile";
            })
            .addCase(fetchUploadedNotes.pending, (state) => {
                state.uploadedNotes.loading = true;
                state.uploadedNotes.error = null;
            })
            .addCase(fetchUploadedNotes.fulfilled, (state, action) => {
                state.uploadedNotes.loading = false;
                state.uploadedNotes.data = action.payload;
                state.uploadedNotes.error = null;
            })
            .addCase(fetchUploadedNotes.rejected, (state) => {
                state.uploadedNotes.loading = false;
                state.uploadedNotes.error = "Failed to load uploaded notes";
            })
    },
});

export const { clearMeState } = meSlice.actions;
export default meSlice.reducer;