import { createSlice } from "@reduxjs/toolkit";
import type { MeState } from "./me.types";
import {
    fetchMyProfile,
    fetchUploadedNotes,
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
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.profile = { ...state.profile, data: action.payload, loading: false };
            })
            .addCase(fetchMyProfile.rejected, (state) => {
                state.profile = { ...state.profile, loading: false };
            })

            .addCase(fetchUploadedNotes.fulfilled, (state, action) => {
                state.uploadedNotes = { ...state.uploadedNotes, data: action.payload, loading: false };
            });
    },
});

export const { clearMeState } = meSlice.actions;
export default meSlice.reducer;