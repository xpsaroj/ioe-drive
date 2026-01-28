export interface User {
    id: string;
    clerkUserId: string;
    fullName: string;
    email: string;
}

export enum SemesterEnum {
    FIRST = "1st",
    SECOND = "2nd",
    THIRD = "3rd",
    FOURTH = "4th",
    FIFTH = "5th",
    SIXTH = "6th",
    SEVENTH = "7th",
    EIGHTH = "8th",
}

export interface UserProfile {
    id: string;
    userId: string;
    bio?: string;
    departmentId?: string;
    semester?: SemesterEnum;
    college?: string;
    profilePictureUrl?: string;
}