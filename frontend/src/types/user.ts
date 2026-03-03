import type { Program, Semester } from "./academics";

export interface User {
    id: number;
    clerkUserId: string;
    fullName: string;
    email: string;
}

export interface Profile {
    id: number;
    userId: number;
    bio?: string;
    programId?: number;
    semester?: Semester;
    college?: string;
    profilePictureUrl?: string;
}

interface ProfileWithProgram extends Profile {
    program?: Program;
}

export interface UserProfile extends User {
    profile: ProfileWithProgram;
}