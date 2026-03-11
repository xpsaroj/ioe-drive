"use client";
import { BookOpen } from "lucide-react";

import { ContainerBox } from "@/components/ui/ContainerBox";
import Button from "@/components/ui/Button";
import { useMe } from "@/hooks/queries/use-me";
import { SemesterLabel } from "@/types";

const CurrentResources = () => {
    const { data: userData, isLoading } = useMe();
    const profile = userData?.profile;

    return (
        <ContainerBox
            title="Current Resources"
            comment="Browse resources for your current program and semester."
            className="md:min-w-xs flex-1"
        >
            <div className="flex flex-col items-center justify-center gap-4 py-4">
                <BookOpen className="w-10 h-10 text-foreground-secondary" />
                {profile && profile?.program && profile?.semester ? (
                    <p className="text-sm text-foreground-secondary text-center">
                        Viewing resources for <span className="font-medium text-foreground">{profile.program.code}</span>, <span className="font-medium text-foreground">{SemesterLabel[profile.semester]} Semester</span>.
                    </p>
                ) : (
                    <p className="text-sm text-foreground-secondary text-center">
                        Set your program and semester in profile settings to get started.
                    </p>
                )}
                <Button
                    variant="primary"
                    className="w-full"
                    disabled={!profile || isLoading}
                    href="/resources/current"
                    icon={<BookOpen className="w-4 h-4" />}
                >
                    View Resources
                </Button>
            </div>
        </ContainerBox>
    );
};

export default CurrentResources;