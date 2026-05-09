import type { ReactNode } from "react";

interface UserResourceListProps<T> {
    data: T[];
    loading?: boolean;
    error?: string | null;
    renderItem: (item: T) => ReactNode;
    emptyMessage?: string;
}

const UserResourceList = <T,>({
    data,
    loading,
    error,
    renderItem,
    emptyMessage = "No data found.",
}: UserResourceListProps<T>) => {
    if (loading) {
        return (
            <div className="border md:p-6 p-0 px-6 py-3 rounded-lg bg-white">
                <p className="text-sm text-foreground-tertiary">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border p-6 rounded-lg bg-white">
                <p className="text-error text-sm">Something went wrong.</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="border p-6 rounded-lg bg-white">
                <p className="text-sm text-foreground-tertiary">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="border md:p-6 p-0 px-6 py-3 rounded-lg bg-white flex flex-col md:gap-6">
            {data.map((item, index) => (
                <div key={index}>{renderItem(item)}</div>
            ))}
        </div>
    );
};

export default UserResourceList;