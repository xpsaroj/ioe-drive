import { LayoutDashboard, NotebookPen, Library, UsersRound, Store, GraduationCap, LucideIcon } from "lucide-react";

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
    { name: 'My Library', href: '/library', icon: Library },
    { name: 'Community', href: '/community', icon: UsersRound },
    { name: 'Market', href: '/market', icon: Store },
    { name: 'Alumni', href: '/alumni', icon: GraduationCap },
];

/**
 * Whether a nav item should render as "active" for the given pathname - matches the
 * item's own route or anything nested under it (e.g. `/library/uploads` under
 * `/library`), but not an unrelated route that merely shares a prefix. Shared by
 * Navbar and MobileNav so both navs agree on the same route (previously each had its
 * own slightly different check).
 */
export const isNavItemActive = (pathname: string, href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);