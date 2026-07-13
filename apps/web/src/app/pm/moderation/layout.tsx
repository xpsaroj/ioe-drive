import type { Metadata } from "next";

import ModerationGate from "./ModerationGate";

// Kept out of search engines via metadata. The real access control is still the
// server-side @Roles("MODERATOR") guard on every moderation endpoint (see
// ModerationGate) - this only keeps it out of search results.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

const ModerationLayout = ({ children }: { children: React.ReactNode }) => (
    <ModerationGate>{children}</ModerationGate>
);

export default ModerationLayout;
