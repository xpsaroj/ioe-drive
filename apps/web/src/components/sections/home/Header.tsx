import Link from "next/link";
import { Github, Heart } from "lucide-react";

import Logo from "@/components/Logo";
import WordmarkText from "@/components/WordmarkText";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Header with logo and primary actions for home page
 */
export default function Header() {
    return (
        <header className="bg-header-background backdrop-blur-md border-b border-header-border">
            <div className="container mx-auto flex items-center justify-between gap-3 py-4 px-6">
                <Link href="/" className="flex items-center gap-2.5 min-w-0">
                    <Logo size={3} bg={false} disableLink />
                    <WordmarkText size="lg" />
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                    <ThemeToggle />

                    {/* Icon-only below sm to keep the header on one line on narrow phones */}
                    <Button
                        variant="secondary"
                        size="md"
                        iconOnly
                        aria-label="Contribute on GitHub"
                        icon={<Github className="size-4" />}
                        href="https://github.com/xpsaroj/ioe-drive/"
                        className="sm:hidden"
                    />
                    <Button
                        variant="secondary"
                        size="md"
                        icon={<Github className="size-4" />}
                        href="https://github.com/xpsaroj/ioe-drive/"
                        className="hidden sm:inline-flex"
                    >
                        Contribute
                    </Button>

                    <Button
                        variant="primary"
                        size="md"
                        iconOnly
                        aria-label="Donate"
                        icon={<Heart className="size-4" />}
                        className="sm:hidden"
                    />
                    <Button
                        variant="primary"
                        size="md"
                        icon={<Heart className="size-4" />}
                        className="hidden sm:inline-flex"
                    >
                        Donate
                    </Button>
                </div>
            </div>
        </header>
    );
}
