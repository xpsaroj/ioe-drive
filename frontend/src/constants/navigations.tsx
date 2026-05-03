import { LayoutDashboard, NotebookPen, UsersRound, Store, GraduationCap, LucideIcon } from "lucide-react";

export interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

/**
 * List of navigation items for the navbar
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', href: '/resources', icon: NotebookPen },
    { name: 'Community', href: '/community', icon: UsersRound },
    { name: 'Market', href: '/market', icon: Store },
    { name: 'Alumni', href: '/alumni', icon: GraduationCap },
];