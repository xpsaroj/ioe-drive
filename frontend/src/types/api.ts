export type ApiResponse<T> = Readonly<{
    success: true;
    data: T;
    message?: string;
} | {
    success: false;
    error: string;
}>;

export type EmptyApiResponse = ApiResponse<null>;