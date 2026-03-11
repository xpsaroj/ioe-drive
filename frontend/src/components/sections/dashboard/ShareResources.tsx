"use client";
import { Upload } from "lucide-react";

import { ContainerBox } from "@/components/ui/ContainerBox";
import Button from "@/components/ui/Button";

const ShareResources = () => {
    return (
        <ContainerBox
            title="Share Resources"
            comment="Upload notes, books, and past questions for your peers."
            className="md:min-w-xs"
        >
            <div className="flex flex-col items-center justify-center gap-4 py-4">
                <Upload className="w-10 h-10 text-foreground-secondary" />
                <p className="text-sm text-foreground-secondary text-center">
                    Help your peers by sharing study materials for your subjects.
                </p>
                <Button
                    variant="primary"
                    className="w-full"
                    href="/resources/share"
                    icon={<Upload className="w-4 h-4" />}
                >
                    Upload Resource
                </Button>
            </div>
        </ContainerBox>
    );
};

export default ShareResources;