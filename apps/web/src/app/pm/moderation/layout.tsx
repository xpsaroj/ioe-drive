import type { Metadata } from "next";

import ModerationGate from "./ModerationGate";

// Kept out of search engines by metadata rather than a robots.txt disallow rule - a
// disallow entry would itself advertise this route's existence to anyone reading
// robots.txt, which defeats the point of not using a guessable /admin path. The real
// access control is still the server-side @Roles("MODERATOR") guard on every
// moderation endpoint (see ModerationGate) - this only keeps it out of search results.
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

const ModerationLayout = ({ children }: { children: React.ReactNode }) => (
    <ModerationGate>{children}</ModerationGate>
);

export default ModerationLayout;
