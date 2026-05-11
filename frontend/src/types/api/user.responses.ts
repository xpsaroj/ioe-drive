export interface ProfileSummary {
    id: number;
    userId: number;
    profilePictureUrl?: string;
}

export interface UserSummary {
    id: number;
    fullName: string;
    profile: ProfileSummary;
}