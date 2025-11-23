export interface NavigationItem {
    name: string;
    href: string;
}

/**
 * List of navigation items for the navbar
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Resources', href: '/resources' },
    { name: 'Community', href: '/community' },
    { name: 'Market', href: '/market' },
    { name: 'Alumni', href: '/alumni' },
];