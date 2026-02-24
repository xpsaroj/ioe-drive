import React from "react";
import Link from "next/link";
import clsx from "clsx";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "outline"
    | "destructive";
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
 * - 5 variants, 3 sizes
 * - Black & white theme aligned with Tailwind v4 design system
 */
const variantStyles: Record<ButtonVariant, string> = {
    // Black background, white text - primary CTA
    primary:
        "bg-button-primary text-button-primary-text hover:bg-button-primary-hover active:bg-button-primary-active focus:ring-button-primary border border-transparent",

    // White background with border, black text - secondary action
    secondary:
        "bg-button-secondary text-button-secondary-text border border-border hover:bg-button-secondary-hover hover:border-border-hover active:bg-button-secondary-active focus:ring-foreground",

    // Transparent background, visible on hover - tertiary action
    ghost:
        "bg-transparent text-foreground hover:bg-button-ghost-hover active:bg-background-active focus:ring-foreground border border-transparent",

    // Outlined style with hover fill - alternative secondary
    outline:
        "bg-transparent text-foreground border border-border hover:bg-foreground hover:text-foreground-inverse hover:border-foreground active:bg-button-primary-active focus:ring-foreground",

    // Error/destructive actions (kept for semantic purposes, using black in b&w theme)
    destructive:
        "bg-error text-error-foreground border border-transparent hover:bg-button-primary-hover active:bg-button-primary-active focus:ring-error",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5 gap-1.5 h-8",
    md: "text-sm px-4 py-2 gap-2 h-10",
    lg: "text-base px-6 py-2.5 gap-2.5 h-12",
};

const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none transition-all duration-200";

const iconOnlySize: Record<ButtonSize, string> = {
    sm: "p-2 h-8 w-8",
    md: "p-2.5 h-10 w-10",
    lg: "p-3 h-12 w-12",
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center justify-center shrink-0">{children}</span>
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
            className
        );

        const iconElement = icon ? (
            <IconWrapper>{icon}</IconWrapper>
        ) : null;

        const content = isIconOnly ? (
            iconElement
        ) : (
            <>
                {icon && iconPosition === "left" && iconElement}
                {children && <span className="truncate">{children}</span>}
                {icon && iconPosition === "right" && iconElement}
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
                    target={href.startsWith("http") ? "_blank" : undefined}
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