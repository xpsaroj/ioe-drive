import { Flame, Clock, CheckCircle2 } from "lucide-react";

// Placeholder data - there's no study-streak/goal-tracking backend yet, so these are
// hardcoded until that's built.
const WEEKLY_STATS = [
    { icon: Flame, label: "Current Streak", value: "12 days" },
    { icon: Clock, label: "Time Studied", value: "8.5 hrs" },
    { icon: CheckCircle2, label: "Goals Met", value: "4/5" },
];

const WeeklySummary = () => (
    <div className="h-full flex flex-col">
        <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Summary</h2>
        {/* flex-1 so this box stretches to match Jump Back In's card height on desktop
        (where the grid row's height is set by the taller column) - on mobile the two
        sections stack instead, so there's no extra height to fill, and this is a no-op. */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-background-secondary divide-y divide-border">
            {WEEKLY_STATS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex-1 flex items-center justify-between gap-4 px-4 py-4">
                    <div className="flex items-center gap-2.5 text-sm text-foreground-secondary">
                        <Icon className="size-4 shrink-0" />
                        {label}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default WeeklySummary;
