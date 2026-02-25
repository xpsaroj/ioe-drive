interface ContainerBoxProps {
    children: React.ReactNode;
    title: string;
    comment?: string;
}

export const ContainerBox = ({
    children,
    title,
    comment
}: ContainerBoxProps) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-300">
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