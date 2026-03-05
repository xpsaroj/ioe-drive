import { createSlice } from "@reduxjs/toolkit";
import type { AcademicsState } from "./academics.types";
import {
    fetchPrograms,
    fetchSubjectOfferings,
} from "./academics.thunks";
import { createAsyncState } from "../../utils";

const initialState: AcademicsState = {
    programs: createAsyncState([]),
    subjectOfferings: createAsyncState([]),
};

export const academicsSlice = createSlice({
    name: "academics",
    initialState,
    reducers: {
        clearAcademicsState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrograms.pending, (state) => {
                state.programs.loading = true;
            })
            .addCase(fetchPrograms.fulfilled, (state, action) => {
                state.programs = { ...state.programs, data: action.payload, loading: false };
            })
            .addCase(fetchPrograms.rejected, (state) => {
                state.programs = { ...state.programs, loading: false };
            })
            .addCase(fetchSubjectOfferings.pending, (state) => {
                state.subjectOfferings.loading = true;
            })
            .addCase(fetchSubjectOfferings.fulfilled, (state, action) => {
                state.subjectOfferings = { ...state.subjectOfferings, data: action.payload, loading: false };
            })
            .addCase(fetchSubjectOfferings.rejected, (state) => {
                state.subjectOfferings = { ...state.subjectOfferings, loading: false };
            });
    },
});

export const { clearAcademicsState } = academicsSlice.actions;
export default academicsSlice.reducer;