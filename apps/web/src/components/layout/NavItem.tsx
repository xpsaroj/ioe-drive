import type { LucideIcon } from "lucide-react";

import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface NavItemProps {
    href: string;
    icon: LucideIcon;
    name: string;
    active: boolean;
    onClick?: () => void;
}

/**
 * A single primary-nav destination, shared by the desktop sidebar (Navbar) and the
 * mobile drawer (MobileNav) so both stay visually identical. The active route gets a
 * soft accent-tinted background plus accent-colored icon/text (see --color-accent in
 * globals.css) - no extra indicator device, so it reads clearly without adding clutter.
 */
const NavItem = ({ href, icon: Icon, name, active, onClick }: NavItemProps) => {
    return (
        <Button
            href={href}
            onClick={onClick}
            variant="ghost"
            className={cn(
                "w-full justify-start border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                    ? "bg-accent-soft text-accent hover:bg-accent-soft"
                    : "text-foreground-secondary hover:text-foreground"
            )}
        >
            <div className="flex gap-2.5 items-center">
                <Icon className={cn("size-4.5", active && "text-accent")} />
                <span className={cn("text-sm", active ? "font-semibold" : "font-medium")}>{name}</span>
            </div>
        </Button>
    );
};

export default NavItem;
