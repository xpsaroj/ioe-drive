import Link from "next/link";
import { UploadCloud, Lightbulb, Play, ArrowRight } from "lucide-react";

import { DotGrid } from "@/components/decor";

const DashboardActions = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link
            href="/resources/share"
            className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background-secondary px-6 py-10 text-center transition-colors duration-150 hover:border-accent hover:bg-background-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <UploadCloud className="size-5" />
            </span>
            <span className="text-base font-semibold text-foreground">Upload Notes</span>
            <span className="text-sm text-foreground-secondary">
                Share notes, past questions, or study guides with your batch.
            </span>
        </Link>

        {/* Placeholder data - there's no recommendation engine yet, so this is a
        hardcoded example of what a future "recommended for you" card would show. */}
        <div className="relative overflow-hidden lg:col-span-2 rounded-xl border border-border bg-background-secondary p-6">
            <DotGrid />

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-foreground-secondary mb-4">
                    <Lightbulb className="size-4" />
                    <span>Recommended for you</span>
                </div>
                <p className="text-sm text-foreground-secondary mb-4">
                    Based on your activity in <span className="text-foreground font-medium">Data Communication</span>
                </p>
                <div className="flex items-center justify-between gap-4 rounded-lg bg-background px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="flex size-9 items-center justify-center rounded-full bg-background-tertiary text-foreground shrink-0">
                            <Play className="size-3.5" fill="currentColor" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">OSI Model Crash Course</p>
                            <p className="text-xs text-foreground-secondary flex items-center gap-2">
                                <span>Video</span>
                                <span>12 mins</span>
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="size-4 text-foreground-secondary shrink-0" />
                </div>
            </div>
        </div>
    </div>
);

export default DashboardActions;
