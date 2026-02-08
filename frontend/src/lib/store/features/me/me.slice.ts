import { createSlice } from "@reduxjs/toolkit";
import type { MeState } from "./me.types";
import {
    fetchMyProfile,
    fetchUploadedNotes,
} from "./me.thunks";

const initialState: MeState = {
    profile: null,
    uploadedNotes: [],
    recentNotes: [],
    archivedNotes: [],
    isLoading: false,
    error: undefined,
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
                state.isLoading = true;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchMyProfile.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(fetchUploadedNotes.fulfilled, (state, action) => {
                state.uploadedNotes = action.payload;
            });
    },
});

export const { clearMeState } = meSlice.actions;
export default meSlice.reducer;