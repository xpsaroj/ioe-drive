import { LayoutDashboard, NotebookPen, Library, UsersRound, Store, GraduationCap, CloudUpload, BookOpen, UserCircle, LucideIcon } from "lucide-react";

export interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

export interface NavigationGroup {
    label: string;
    items: NavigationItem[];
}

/**
 * Primary nav destinations, grouped by what they're about rather than one flat list -
 * shared by the desktop sidebar (Navbar) and the mobile drawer (MobileNav) so both stay
 * in sync.
 */
export const NAVIGATION_GROUPS: NavigationGroup[] = [
    {
        label: "Personal",
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'My Library', href: '/library', icon: Library },
        ],
    },
    {
        label: "Resources",
        items: [
            { name: 'Browse Resources', href: '/resources', icon: NotebookPen },
            { name: 'Share a Resource', href: '/resources/share', icon: CloudUpload },
            { name: 'Curriculum', href: '/offerings', icon: BookOpen },
        ],
    },
    {
        label: "Community",
        items: [
            { name: 'Community', href: '/community', icon: UsersRound },
            { name: 'Market', href: '/market', icon: Store },
            { name: 'Alumni', href: '/alumni', icon: GraduationCap },
        ],
    },
    {
        label: "Account",
        items: [
            { name: 'Profile', href: '/profile', icon: UserCircle },
        ],
    },
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
