import { createAsyncThunk } from "@reduxjs/toolkit";
import { meApi } from "@/lib/api/me-api";

export const fetchMyProfile = createAsyncThunk(
    "me/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await meApi.getMyProfile();
            if (!res.success) {
                return rejectWithValue(res.error || "Failed to load profile");
            }
            return res.data;
        } catch (err) {
            return rejectWithValue("Failed to load profile");
        }
    }
);

export const fetchUploadedNotes = createAsyncThunk(
    "me/fetchUploadedNotes",
    async (_, { rejectWithValue }) => {
        try {
            const res = await meApi.getUploadedNotes();
            if (!res.success) {
                return rejectWithValue(res.error || "Failed to load uploaded notes");
            }
            return res.data;
        } catch {
            return rejectWithValue("Failed to load uploaded notes");
        }
    }
);

export const fetchRecentNotes = createAsyncThunk(
    "me/fetchRecentNotes",
    async (_, { rejectWithValue }) => {
        try {
            const res = await meApi.getRecentNotes();
            if (!res.success) {
                return rejectWithValue(res.error || "Failed to load recent notes");
            }
            return res.data;
        } catch {
            return rejectWithValue("Failed to load recent notes");
        }
    }
);

export const fetchArchivedNotes = createAsyncThunk(
    "me/fetchArchivedNotes",
    async (_, { rejectWithValue }) => {
        try {
            const res = await meApi.getArchivedNotes();
            if (!res.success) {
                return rejectWithValue(res.error || "Failed to load archived notes");
            }
            return res.data;
        } catch {
            return rejectWithValue("Failed to load archived notes");
        }
    }
);

