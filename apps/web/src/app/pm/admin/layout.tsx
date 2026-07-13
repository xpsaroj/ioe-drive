import type { Metadata } from "next";

import AdminGate from "./AdminGate";

// Kept out of search engines by metadata rather than a robots.txt disallow rule - see
// the same note in app/pm/moderation/layout.tsx. The real access control is still the
// server-side @Roles("ADMIN") guard on the admin endpoint (see AdminGate) - this only
// keeps it out of search results.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <AdminGate>{children}</AdminGate>
);

export default AdminLayout;
