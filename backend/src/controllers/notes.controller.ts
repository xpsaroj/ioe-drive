import type { Request, Response } from "express";

export const markNoteAsRecentlyAccessed = (req: Request, res: Response) => {
    res.json({ message: `Mark note with id: ${req.params.noteId} as recently accessed by some user (defined later).` });
};

export const markNoteAsArchived = (req: Request, res: Response) => {
    res.json({ message: `Mark note with id: ${req.params.noteId} as bookmarked/archived by some user (defined later).` });
};