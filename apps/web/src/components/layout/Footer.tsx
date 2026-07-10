import Link from "next/link";
import { Github } from "lucide-react";

import Logo from "./Logo";
import WordmarkText from "./WordmarkText";

export default function Footer() {
    return (
        <footer className="bg-background-secondary border-t border-border">
            <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8 text-center sm:text-left">
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <Logo size={2} bg={false} disableLink />
                        <WordmarkText size="sm" />
                    </Link>

                    <div className="space-y-1 sm:max-w-sm">
                        <p className="text-sm text-foreground-secondary">
                            Developed by <span className="font-semibold text-foreground">SS Dev Core</span>
                        </p>
                        <p className="text-sm text-foreground-secondary">
                            This website is still being built. If you want to contribute in any
                            way please leave message on discord at{" "}
                            <Link
                                href="https://discord.gg/indeed_sunil"
                                className="font-semibold text-foreground hover:text-accent transition-colors"
                            >
                                indeed_sunil
                            </Link>
                            {" or "}
                            <Link
                                href="https://discord.gg/xpsaroj"
                                className="font-semibold text-foreground hover:text-accent transition-colors"
                            >
                                xpsaroj
                            </Link>.
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-foreground-tertiary">
                        &copy; {new Date().getFullYear()} SS Dev Core. All rights reserved.
                    </p>

                    <Link
                        href="https://github.com/xpsaroj/ioe-drive/"
                        className="flex items-center gap-1.5 text-xs text-foreground-tertiary hover:text-foreground transition-colors"
                    >
                        <Github className="size-3.5" />
                        View source
                    </Link>
                </div>
            </div>
        </footer>
    );
}
