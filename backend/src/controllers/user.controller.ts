import type { Request, Response } from "express";

export const getCurrentUserProfile = (req: Request, res: Response) => {
    res.json({ message: "Get current user's profile" });
};

export const getUserProfileById = (req: Request, res: Response) => {
    res.json({ message: `Get profile of user with id: ${req.params.userId}` });
};

export const getUserUploadedNotes = (req: Request, res: Response) => {
    res.json({ message: `Get all notes uploaded by the user with id: ${req.params.userId}` });
};

export const getUserRecentlyAccessedNotes = (req: Request, res: Response) => {
    res.json({ message: `Get notes recently accessed by the user with id: ${req.params.userId}` });
};

export const getUserArchivedNotes = (req: Request, res: Response) => {
    res.json({ message: `Get notes bookmarked/archived by the user with id: ${req.params.userId}` });
};