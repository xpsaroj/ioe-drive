import type { AsyncState } from "@/types";

export const createAsyncState = <T>(initialData: T): AsyncState<T> => ({
    data: initialData,
    loading: false,
    error: null,
});