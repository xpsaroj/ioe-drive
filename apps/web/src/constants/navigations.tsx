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

/** All nav hrefs across every group, used to resolve which item wins when a
 * pathname is nested under more than one of them (see isNavItemActive below). */
const ALL_NAV_HREFS: string[] = NAVIGATION_GROUPS.flatMap((group) => group.items.map((item) => item.href));

const matchesRoute = (pathname: string, href: string): boolean =>
    pathname === href || pathname.startsWith(`${href}/`);

/**
 * Whether a nav item should render as "active" for the given pathname - matches the
 * item's own route or anything nested under it (e.g. `/library/uploads` under
 * `/library`), but not an unrelated route that merely shares a prefix. Shared by
 * Navbar and MobileNav so both navs agree on the same route (previously each had its
 * own slightly different check).
 *
 * Only the most specific (longest) matching href among all nav items is considered
 * active, so a parent route doesn't light up alongside a sibling nested under the
 * same path segment - e.g. `/resources/share` has its own nav entry, so `/resources`
 * (which `/resources/share` would otherwise also match as a prefix) must lose to it.
 */
export const isNavItemActive = (pathname: string, href: string, allHrefs: string[] = ALL_NAV_HREFS): boolean => {
    if (!matchesRoute(pathname, href)) return false;

    return !allHrefs.some(
        (other) => other !== href && other.length > href.length && matchesRoute(pathname, other)
    );
};
