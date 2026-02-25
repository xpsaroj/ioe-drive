import type { Department, Semester } from "./academics";

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
    departmentId?: number;
    semester?: Semester;
    college?: string;
    profilePictureUrl?: string;
}

interface ProfileWithDepartment extends Profile {
    department?: Department;
}

export interface UserProfile extends User {
    profile: ProfileWithDepartment;
}