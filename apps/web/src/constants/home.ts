import { NotebookPen, Store, UsersRound, Library, type LucideIcon } from "lucide-react";

export interface Feature {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
}

export const features: Feature[] = [
    {
        title: "Study Materials",
        description: "Access and share notes, question banks, and resources organized by department and courses.",
        href: "/resources",
        icon: NotebookPen,
    },
    {
        title: "Marketplace",
        description: "Buy and sell second-hand engineering items like books, tools, and equipment within the IOE community.",
        href: "/market",
        icon: Store,
    },
    {
        title: "Student Community",
        description: "Ask questions, share tips, and interact with seniors and juniors through comments and discussions.",
        href: "/community",
        icon: UsersRound,
    },
    {
        title: "My Library",
        description: "Save your uploads, bookmarks, and downloaded materials in one organized, easily accessible place.",
        href: "/library",
        icon: Library,
    }
]
