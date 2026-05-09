"use client"
import { use } from "react"
import { useRouter } from "next/navigation";
import { useNote } from "@/hooks/queries/use-notes";
import { ChevronLeft, User2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { ResourceFileList } from "@/components/common/resources";

interface ResourcePageProps {
    params: Promise<{
        resourceId: string;
    }>
}

const ResourcePage = ({
    params
}: ResourcePageProps) => {
    const { resourceId: rId } = use(params);
    const resourceId = Number(rId);

    const router = useRouter();

    const { data: note, isPending, error } = useNote(resourceId);

    if (isPending) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        icon={<ChevronLeft className="size-4" />}
                        iconOnly
                        variant="ghost"
                        size="xs"
                        className="border border-border"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-xl md:text-2xl font-medium">Resource Details</h1>
                </div>
                <div className="flex-1 flex items-center justify-center border rounded-lg">
                    <Loader text="Loading resource details. Please wait." />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        icon={<ChevronLeft className="size-4" />}
                        iconOnly
                        variant="ghost"
                        size="xs"
                        className="border border-border"
                        onClick={() => router.back()}
                    />
                    <h1 className="text-xl md:text-2xl font-medium">Resource Details</h1>
                </div>
                <div className="flex-1 flex items-center justify-center border rounded-lg">
                    <p className="text-red-500">Something went wrong. Please try again later.</p>
                </div>
            </div>
        )
    }

    if (!resourceId || isNaN(resourceId) || !note) {
        return <NotFoundReturn />
    }

    const { files = [] } = note;
    const createdAt = new Date(note.createdAt);
    const formattedCreatedAt = createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <Button
                    icon={<ChevronLeft className="size-4" />}
                    iconOnly
                    href="/resources"
                    variant="ghost"
                    size="xs"
                    className="border border-border"
                />
                <h1 className="text-xl md:text-2xl font-medium">Resource Details</h1>
            </div>

            <div className="flex flex-col justify-center border gap-1 rounded-lg py-3 md:p-6">
                <div className="mb-3 pb-3 border-b">
                    <h2 className="text-xl font-semibold">{note.subject.name} Resources</h2>
                    <p className="text-sm text-foreground-secondary">{note.subject.code} • {note.subject.name}</p>
                </div>

                <div className="border-b pb-3 mb-3">
                    <h3 className="text-xl font-bold">{note.title}</h3>

                    <div className="text-xs text-foreground-tertiary flex items-center gap-1 mt-3">
                        {note.uploader && (
                            <div className="text-xs text-foreground-tertiary flex items-center gap-1">
                                <User2 className="inline size-6 rounded-full border p-1.5 box-content" />
                                <div className="flex flex-col">
                                    <span className="text-foreground-secondary">{note.uploader.fullName}</span>
                                    <span>{formattedCreatedAt}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-foreground border-b pb-3 mb-3">{note.description}</p>
                <ResourceFileList resourceFiles={files} />
            </div>
        </div>
    )
}

export default ResourcePage;

const NotFoundReturn = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground md:p-8 p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <Button
                    icon={<ChevronLeft className="size-4" />}
                    iconOnly
                    variant="ghost"
                    size="xs"
                    className="border border-border"
                    onClick={() => router.back()}
                />
                <h1 className="text-xl md:text-2xl font-medium">Resource Details</h1>
            </div>
            <div className="flex-1 flex items-center justify-center border rounded-lg">
                <p className="text-gray-500">The resource you are looking for does not exist.</p>
            </div>
        </div>
    )
}