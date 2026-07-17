import Link from "next/link";

import SubjectHardnessBadge from "./SubjectHardnessBadge";
import type { SubjectOfferingWithSubject } from "@/types/entities";

interface SubjectOfferingCardProps {
    offering: SubjectOfferingWithSubject;
}

// Shared by the curriculum directory and a program's own subject list
const SubjectOfferingCard = ({ offering }: SubjectOfferingCardProps) => (
    <Link
        href={`/offerings/${offering.id}`}
        className="group flex flex-col rounded-xl border border-border bg-card-background p-5 transition-colors hover:border-accent hover:bg-card-hover"
    >
        <div className="flex items-start justify-between gap-3">
            <span className="rounded-md border border-border px-2 py-1 font-display text-xs uppercase tracking-wide text-foreground-tertiary">
                {offering.subject.code}
            </span>
            <SubjectHardnessBadge level={offering.subject.hardnessLevel} size="sm" className="shrink-0" />
        </div>

        <p className="mt-3 font-semibold text-foreground decoration-2 underline-offset-2 group-hover:underline">
            {offering.subject.name}
        </p>

        {offering.subject.description && (
            <p className="mt-1 line-clamp-2 text-sm text-foreground-secondary">
                {offering.subject.description}
            </p>
        )}
    </Link>
);

export default SubjectOfferingCard;
