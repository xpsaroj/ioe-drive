import { createAsyncThunk } from "@reduxjs/toolkit";
import { academicsApi, type SubjectsFilters } from "@/lib/api/academics-api";

export const fetchPrograms = createAsyncThunk(
    "academics/fetchPrograms",
    async (_, { rejectWithValue }) => {
        try {
            const res = await academicsApi.getAllPrograms();
            if (!res.success) {
                return rejectWithValue(res.error || "Failed to load programs");
            }
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to load programs");
        }
    }
);

export const fetchSubjectOfferings = createAsyncThunk(
    "academics/fetchSubjectOfferings",
    async (
        { semester, programId }: SubjectsFilters,
        { rejectWithValue }
    ) => {
        try {
            const res = await academicsApi.getSubjectsByProgramAndSemester({ semester, programId });
            if (!res.success) {
                return rejectWithValue(res.error || "Failed to load subject offerings");
            }
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to load subject offerings");
        }
    }
);