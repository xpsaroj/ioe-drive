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
        <div className={clsx("bg-background p-6 rounded-xl border", className)}>
            <h3 className="text-lg font-semibold text-foreground select-text">
                {title}
            </h3>
            {comment && (
                <p className="text-xs text-foreground-secondary mb-4 italic">
                    {comment}
                </p>
            )}
            {children}
        </div>
    )
}