import { ProgramSummary } from "./academics.responses";
import { Semester } from "../entities";

export interface ProfileSummary {
    id: number;
    userId: number;
    bio?: string;
    programId?: number;
    semester?: Semester;
    college?: string;
    profilePictureUrl?: string;
    program?: ProgramSummary;
}

export interface UploaderSummary {
    id: number;
    fullName: string;
    profile: {
        id: number;
        userId: number;
        profilePictureUrl?: string;
    };
}

export interface UserProfileSummary {
    id: number;
    fullName: string;
    createdAt: string;
    profile: ProfileSummary;
}