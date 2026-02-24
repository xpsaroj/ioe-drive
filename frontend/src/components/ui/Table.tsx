"use client";

import React from "react";
import clsx from "clsx";

// ========== Types ==========
export interface Column<T> {
    key: string;
    label: string;
    render?: (item: T, index: number) => React.ReactNode;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    width?: string;
}

export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    /**
     * Striped rows (alternating background colors)
     */
    striped?: boolean;
    /**
     * Enable hover effect on rows
     */
    hoverable?: boolean;
    /**
     * Make rows clickable
     */
    onRowClick?: (item: T, index: number) => void;
    /**
     * Loading state - shows skeleton
     */
    loading?: boolean;
    /**
     * Empty state message
     */
    emptyMessage?: string;
    /**
     * Enable sorting
     */
    sortable?: boolean;
    /**
     * Custom className for table wrapper
     */
    className?: string;
    /**
     * Custom className for the table element
     */
    tableClassName?: string;
}

// ========== Table Component ==========
function Table<T>({
    data,
    columns,
    striped = false,
    hoverable = true,
    onRowClick,
    loading = false,
    emptyMessage = "No data available",
    sortable = false,
    className,
    tableClassName,
}: TableProps<T>) {
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    // Sorting logic
    const sortedData = React.useMemo(() => {
        if (!sortConfig || !sortable) return data;

        return [...data].sort((a: any, b: any) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig, sortable]);

    const handleSort = (columnKey: string, columnSortable?: boolean) => {
        if (!sortable || !columnSortable) return;

        setSortConfig((current) => {
            if (current?.key === columnKey) {
                return {
                    key: columnKey,
                    direction: current.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key: columnKey, direction: "asc" };
        });
    };

    const getAlignClass = (align?: "left" | "center" | "right") => {
        switch (align) {
            case "center":
                return "text-center";
            case "right":
                return "text-right";
            default:
                return "text-left";
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={clsx("w-full overflow-auto rounded-lg border border-border", className)}>
                <table className={clsx("w-full text-sm", tableClassName)}>
                    <thead className="bg-background-tertiary border-b border-border">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={clsx(
                                        "px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wide",
                                        getAlignClass(column.align)
                                    )}
                                    style={{ width: column.width }}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <tr key={idx} className="border-b border-border">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={clsx("px-4 py-3", getAlignClass(column.align))}
                                    >
                                        <div className="h-4 bg-skeleton-base animate-pulse rounded" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className={clsx("w-full overflow-auto rounded-lg border border-border", className)}>
            <table className={clsx("w-full text-sm", tableClassName)}>
                {/* Header */}
                <thead className="bg-background-tertiary border-b border-border">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={clsx(
                                    "px-4 py-3 font-medium text-foreground-secondary text-xs uppercase tracking-wide",
                                    getAlignClass(column.align),
                                    column.sortable && sortable && "cursor-pointer select-none hover:text-foreground"
                                )}
                                style={{ width: column.width }}
                                onClick={() => handleSort(column.key, column.sortable)}
                            >
                                <div className="flex items-center gap-2">
                                    {column.label}
                                    {column.sortable && sortable && (
                                        <span className="text-foreground-muted">
                                            {sortConfig?.key === column.key
                                                ? sortConfig.direction === "asc"
                                                    ? "↑"
                                                    : "↓"
                                                : "↕"}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body */}
                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-12 text-center text-foreground-muted"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={clsx(
                                    "border-b border-border last:border-b-0 transition-colors",
                                    hoverable && "hover:bg-background-hover",
                                    onRowClick && "cursor-pointer",
                                    striped && rowIndex % 2 === 1 && "bg-background-secondary"
                                )}
                                onClick={() => onRowClick?.(item, rowIndex)}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={clsx(
                                            "px-4 py-3 text-foreground",
                                            getAlignClass(column.align)
                                        )}
                                    >
                                        {column.render
                                            ? column.render(item, rowIndex)
                                            : (item as any)[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;