import clsx from "clsx";

interface ContainerBoxProps {
    children: React.ReactNode;
    title: string;
    comment?: string;
    className?: string;
}

export const ContainerBox = ({
    children,
    title,
    comment,
    className = "",
}: ContainerBoxProps) => {
    return (
        <div className={clsx("bg-white p-6 rounded-xl shadow-sm border border-gray-300", className)}>
            <h3 className="text-lg font-semibold text-gray-800 select-text">
                {title}
            </h3>
            {comment && (
                <p className="text-xs text-gray-500 mb-4 italic">
                    {comment}
                </p>
            )}
            {children}
        </div>
    )
}