import React from "react";
import Link from "next/link";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * When provided the button will render as a link (wrapped with Next.js Link)
     */
    href?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    /**
     * Any React node (e.g. an icon from lucide-react)
     */
    icon?: React.ReactNode;
    /**
     * "left" or "right" position for icon relative to children
     */
    iconPosition?: "left" | "right";
    /**
     * If true, renders a compact icon-only button (children should be empty).
     * When using iconOnly, provide an aria-label on the Button for accessibility.
     */
    iconOnly?: boolean;
    className?: string;
}

/**
 * Button
 * - supports optional icon (left/right)
 * - wraps in Next.js Link when href provided
 * - 4 variants, 3 sizes
 */
const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-accent text-white hover:bg-purple-500 focus:ring-accent transition-all duration-300",
    secondary:
        "bg-transparent border border-accent text-primary hover:bg-accent hover:text-white focus:ring-accent transition-all duration-300",
    ghost:
        "bg-transparent text-foreground hover:bg-accent focus:ring-foreground transition-all duration-300",
    destructive:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 transition-all duration-300",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-3 gap-3",
};

const base =
    "inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none cursor-pointer";

const iconOnlySize: Record<ButtonSize, string> = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center">{children}</span>
);

const Button = React.forwardRef<HTMLElement, ButtonProps>(
    (
        {
            href,
            variant = "primary",
            size = "md",
            icon,
            iconPosition = "left",
            iconOnly = false,
            className,
            children,
            ...rest
        },
        ref
    ) => {
        const isIconOnly = iconOnly || (!children && !!icon);
        const classes = clsx(
            base,
            variantStyles[variant],
            isIconOnly ? iconOnlySize[size] : sizeStyles[size],
            isIconOnly ? "rounded-full" : "rounded-md",
            className
        );

        const iconLeft =
            icon && !isIconOnly && iconPosition === "left" ? (
                <IconWrapper>
                    <span className="mr-2">{icon}</span>
                </IconWrapper>
            ) : null;

        const iconRight =
            icon && !isIconOnly && iconPosition === "right" ? (
                <IconWrapper>
                    <span className="ml-2">{icon}</span>
                </IconWrapper>
            ) : null;

        const iconOnlyContent = icon ? (
            <IconWrapper>{icon}</IconWrapper>
        ) : null;

        const content = isIconOnly ? iconOnlyContent : (
            <>
                {iconLeft}
                <span>{children}</span>
                {iconRight}
            </>
        );

        // If href provided, render as link
        if (href) {
            return (
                <Link
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ref={ref as any}
                    href={href}
                    className={classes}
                >
                    {content}
                </Link>
            );
        }

        // Normal button
        return (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <button ref={ref as any} className={classes} {...rest}>
                {content}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;