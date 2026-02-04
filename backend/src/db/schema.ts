import {
    integer,
    pgTable,
    varchar,
    timestamp,
    text,
    pgEnum,
    unique,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const SemesterEnum = pgEnum("semester_enum", ["1", "2", "3", "4", "5", "6", "7", "8"]);
export const SubjectHardnessLevelEnum = pgEnum("subject_hardness_level_enum", ["EASY", "MEDIUM", "HARD", "VERY_HARD"]);

export type Semester = (typeof SemesterEnum.enumValues)[number];
export type SubjectHardnessLevel = (typeof SubjectHardnessLevelEnum.enumValues)[number];

// Tables
export const webhookEventsTable = pgTable("webhook_events", {
    svixId: text("svix_id").primaryKey(),
    eventType: varchar("event_type", { length: 255 }).notNull(),
    receivedAt: timestamp("received_at").defaultNow(),
});

export const departmentsTable = pgTable("departments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
});

export const subjectsTable = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    departmentId: integer("department_id")
        .references(() => departmentsTable.id)
        .notNull(),
    hardnessLevel: SubjectHardnessLevelEnum("hardness_level").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const marksTable = pgTable("subject_marks", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer("subject_id")
        .references(() => subjectsTable.id, { onDelete: "cascade" })
        .notNull(),
    theoryAssessment: integer("theory_assessment").notNull().default(0),
    theoryFinal: integer("theory_final").notNull().default(0),
    practicalAssessment: integer("practical_assessment").notNull().default(0),
    practicalFinal: integer("practical_final").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
},
    (table) => [
        unique("unique_subject_marks").on(table.subjectId),
        index("idx_subject_marks_subject_id").on(table.subjectId),
    ]
);

export const subjectOfferingsTable = pgTable("subject_offerings", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer("subject_id")
        .references(() => subjectsTable.id)
        .notNull(),
    semester: SemesterEnum("semester").notNull(),
    departmentId: integer("department_id")
        .references(() => departmentsTable.id)
        .notNull(),
    year: integer("year").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
},
    (table) => [
        unique("unique_subject_offering").on(
            table.subjectId,
            table.semester,
            table.departmentId,
            table.year
        ),
        index("idx_subject_offerings_semester_department").on(table.semester, table.departmentId),
        index("idx_subject_offerings_department").on(table.departmentId),
        index("idx_subject_offerings_subject").on(table.subjectId),
    ]
);

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const profilesTable = pgTable("profiles", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull()
        .unique(),
    bio: text("bio"),
    departmentId: integer("department_id").references(() => departmentsTable.id),
    semester: SemesterEnum("semester"),
    college: text("college"),
    profilePictureUrl: text("profile_picture_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const notesTable = pgTable("notes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    subjectId: integer("subject_id")
        .references(() => subjectsTable.id)
        .notNull(),
    uploadedBy: integer("uploaded_by")
        .references(() => usersTable.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
},
    (table) => [
        index("idx_notes_subject_id").on(table.subjectId),
        index("idx_notes_uploaded_by").on(table.uploadedBy),
    ]
);

export const noteFilesTable = pgTable("note_files", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    noteId: integer("note_id")
        .references(() => notesTable.id, { onDelete: "cascade" })
        .notNull(),
    fileUrl: text("file_url").notNull(),
    fileSize: integer("file_size").notNull(),
    originalFileName: text("original_file_name").notNull(),
    blobName: text("blob_name").notNull(),
    compressedSize: integer("compressed_size"),
    compressionMethod: varchar("compression_method", { length: 100 }),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
},
    (table) => [
        index("idx_note_files_note_id").on(table.noteId),
    ]
);

export const userRecentNotesTable = pgTable("user_recent_notes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    noteId: integer("note_id")
        .references(() => notesTable.id, { onDelete: "cascade" })
        .notNull(),
    accessedAt: timestamp("accessed_at").defaultNow().notNull(),
},
    (table) => [
        unique("unique_user_recent_note").on(
            table.userId,
            table.noteId
        ),
        index("idx_user_recent_notes_user_id").on(table.userId),
    ]
);

export const userArchivedNotesTable = pgTable("user_archived_notes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    noteId: integer("note_id")
        .references(() => notesTable.id, { onDelete: "cascade" })
        .notNull(),
    archivedAt: timestamp("archived_at").defaultNow().notNull(),
},
    (table) => [
        unique("unique_user_archived_note").on(
            table.userId,
            table.noteId
        ),
        index("idx_user_archived_notes_user_id").on(table.userId),
    ]
);


// Relations
export const departmentRelations = relations(departmentsTable, ({ many }) => ({
    subjects: many(subjectsTable),
    subjectOfferings: many(subjectOfferingsTable),
}))

export const subjectRelations = relations(subjectsTable, ({ many, one }) => ({
    department: one(departmentsTable, {
        fields: [subjectsTable.departmentId],
        references: [departmentsTable.id]
    }),
    subjectOfferings: many(subjectOfferingsTable),
    marks: one(marksTable, {
        fields: [subjectsTable.id],
        references: [marksTable.subjectId]
    }),
    notes: many(notesTable),
}));

export const subjectOfferingRelations = relations(subjectOfferingsTable, ({ one }) => ({
    subject: one(subjectsTable, {
        fields: [subjectOfferingsTable.subjectId],
        references: [subjectsTable.id]
    }),
    department: one(departmentsTable, {
        fields: [subjectOfferingsTable.departmentId],
        references: [departmentsTable.id]
    }),
}));

export const userRelations = relations(usersTable, ({ one, many }) => ({
    profile: one(profilesTable),
    notes: many(notesTable),
    recentNotes: many(userRecentNotesTable),
    archivedNotes: many(userArchivedNotesTable),
}));

export const profileRelations = relations(profilesTable, ({ one }) => ({
    department: one(departmentsTable, {
        fields: [profilesTable.departmentId],
        references: [departmentsTable.id]
    }),
    user: one(usersTable, {
        fields: [profilesTable.userId],
        references: [usersTable.id]
    }),
}));

export const noteRelations = relations(notesTable, ({ one, many }) => ({
    subject: one(subjectsTable, {
        fields: [notesTable.subjectId],
        references: [subjectsTable.id]
    }),
    uploader: one(usersTable, {
        fields: [notesTable.uploadedBy],
        references: [usersTable.id]
    }),
    files: many(noteFilesTable),
}));

export const noteFileRelations = relations(noteFilesTable, ({ one }) => ({
    note: one(notesTable, {
        fields: [noteFilesTable.noteId],
        references: [notesTable.id]
    }),
}));

export const userRecentNoteRelations = relations(userRecentNotesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userRecentNotesTable.userId],
        references: [usersTable.id]
    }),
    note: one(notesTable, {
        fields: [userRecentNotesTable.noteId],
        references: [notesTable.id]
    }),
}));

export const userArchivedNoteRelations = relations(userArchivedNotesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userArchivedNotesTable.userId],
        references: [usersTable.id]
    }),
    note: one(notesTable, {
        fields: [userArchivedNotesTable.noteId],
        references: [notesTable.id]
    }),
}));