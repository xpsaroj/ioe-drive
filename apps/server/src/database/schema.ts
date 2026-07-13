import {
    integer,
    pgTable,
    varchar,
    timestamp,
    text,
    pgEnum,
    unique,
    index,
    boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const SemesterEnum = pgEnum("semester_enum", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
export const YearEnum = pgEnum("year_enum", ["1", "2", "3", "4", "5"]);
export const SubjectHardnessLevelEnum = pgEnum("subject_hardness_level_enum", ["EASY", "MEDIUM", "HARD", "VERY_HARD"]);
export const ResourceTypeEnum = pgEnum("resource_type_enum", ["NOTE", "PAST_QUESTION", "ASSESSMENT", "LAB_SHEET", "BOOK", "OTHER"]);
// ADMIN can do everything MODERATOR can (checked via explicit @Roles("MODERATOR",
// "ADMIN") lists, not a hierarchy resolver - see roles.guard.ts), plus manage other
// users' USER/MODERATOR role. Granting/revoking ADMIN itself is never done through the
// app - only ever a direct database change.
export const UserRoleEnum = pgEnum("user_role_enum", ["USER", "MODERATOR", "ADMIN"]);
// REJECTED is resubmittable (owner can edit -> back to PENDING); REMOVED is terminal
// (moderator took the resource down for good - files get deleted, the row stays only
// so the uploader can see it happened and why).
export const ResourceStatusEnum = pgEnum("resource_status_enum", ["PENDING", "APPROVED", "REJECTED", "REMOVED"]);
export const ModerationReasonEnum = pgEnum("moderation_reason_enum", [
    "INAPPROPRIATE_CONTENT",
    "WRONG_SUBJECT",
    "SPAM_OR_LOW_QUALITY",
    "COPYRIGHT",
    "OTHER",
]);
export const ReportStatusEnum = pgEnum("report_status_enum", ["OPEN", "RESOLVED"]);
export const ModerationActionEnum = pgEnum("moderation_action_enum", ["APPROVE", "REJECT", "REMOVE"]);

export type Semester = (typeof SemesterEnum.enumValues)[number];
export type Year = (typeof YearEnum.enumValues)[number];
export type SubjectHardnessLevel = (typeof SubjectHardnessLevelEnum.enumValues)[number];
export type ResourceType = (typeof ResourceTypeEnum.enumValues)[number];
export type UserRole = (typeof UserRoleEnum.enumValues)[number];
export type ResourceStatus = (typeof ResourceStatusEnum.enumValues)[number];
export type ModerationReason = (typeof ModerationReasonEnum.enumValues)[number];
export type ReportStatus = (typeof ReportStatusEnum.enumValues)[number];
export type ModerationAction = (typeof ModerationActionEnum.enumValues)[number];

// Tables
export const webhookEventsTable = pgTable("webhook_events", {
    svixId: text("svix_id").primaryKey(),
    eventType: varchar("event_type", { length: 255 }).notNull(),
    receivedAt: timestamp("received_at").defaultNow(),
});

export const programsTable = pgTable("programs", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 10 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    totalYears: integer("total_years").default(4).notNull(),
    syllabusUrl: varchar("syllabus_url", { length: 255 }),
});

export const subjectsTable = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 15 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    programId: integer("program_id")
        .references(() => programsTable.id)
        .notNull(),
    hardnessLevel: SubjectHardnessLevelEnum("hardness_level").notNull(),
    description: text("description"),
    syllabusUrl: varchar("syllabus_url", { length: 255 }),
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
    programId: integer("program_id")
        .references(() => programsTable.id)
        .notNull(),
    year: YearEnum("year").notNull(),
    isElective: boolean("is_elective").default(false).notNull(),
},
    (table) => [
        unique("unique_subject_offering").on(
            table.subjectId,
            table.semester,
            table.programId,
            table.year
        ),
        index("idx_subject_offerings_semester_program").on(table.semester, table.programId),
        index("idx_subject_offerings_program").on(table.programId),
        index("idx_subject_offerings_subject").on(table.subjectId),
    ]
);

export const usersTable = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).unique(),
    role: UserRoleEnum("role").notNull().default("USER"),
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
    programId: integer("program_id").references(() => programsTable.id),
    semester: SemesterEnum("semester"),
    college: text("college"),
    profilePictureUrl: text("profile_picture_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const resourcesTable = pgTable("resources", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    type: ResourceTypeEnum("type").notNull(),
    offeringId: integer("offering_id")
        .references(() => subjectOfferingsTable.id)
        .notNull(),
    uploadedBy: integer("uploaded_by")
        .references(() => usersTable.id, { onDelete: "set null" }),
    // No schema-level default - the application always sets this explicitly
    // (see ResourcesService.createResource), same as `type` already does. The
    // migration backfilled every pre-existing resource to APPROVED via a temporary
    // default, then dropped it (see 0011/0012), mirroring how
    // 0010_rename_notes_to_resources.sql added `type` to a populated table.
    status: ResourceStatusEnum("status").notNull(),
    moderatedBy: integer("moderated_by")
        .references(() => usersTable.id, { onDelete: "set null" }),
    moderationReason: ModerationReasonEnum("moderation_reason"),
    moderationNote: text("moderation_note"),
    moderatedAt: timestamp("moderated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
},
    (table) => [
        index("idx_resources_offering_id").on(table.offeringId),
        index("idx_resources_uploaded_by").on(table.uploadedBy),
        index("idx_resources_status").on(table.status),
    ]
);

export const resourceFilesTable = pgTable("resource_files", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    resourceId: integer("resource_id")
        .references(() => resourcesTable.id, { onDelete: "cascade" })
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
        index("idx_resource_files_resource_id").on(table.resourceId),
    ]
);

export const userRecentResourcesTable = pgTable("user_recent_resources", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    resourceId: integer("resource_id")
        .references(() => resourcesTable.id, { onDelete: "cascade" })
        .notNull(),
    accessedAt: timestamp("accessed_at").defaultNow().notNull(),
},
    (table) => [
        unique("unique_user_recent_resource").on(
            table.userId,
            table.resourceId
        ),
        index("idx_user_recent_resources_user_id").on(table.userId),
    ]
);

export const userBookmarkedResourcesTable = pgTable("user_bookmarked_resources", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    resourceId: integer("resource_id")
        .references(() => resourcesTable.id, { onDelete: "cascade" })
        .notNull(),
    bookmarkedAt: timestamp("bookmarked_at").defaultNow().notNull(),
},
    (table) => [
        unique("unique_user_bookmarked_resource").on(
            table.userId,
            table.resourceId
        ),
        index("idx_user_bookmarked_resources_user_id").on(table.userId),
    ]
);

export const reportsTable = pgTable("reports", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    resourceId: integer("resource_id")
        .references(() => resourcesTable.id, { onDelete: "cascade" })
        .notNull(),
    reportedBy: integer("reported_by")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    reason: ModerationReasonEnum("reason").notNull(),
    note: text("note"),
    status: ReportStatusEnum("status").notNull().default("OPEN"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at"),
    resolvedBy: integer("resolved_by")
        .references(() => usersTable.id, { onDelete: "set null" }),
},
    (table) => [
        unique("unique_report_per_user_resource").on(table.resourceId, table.reportedBy),
        index("idx_reports_resource_id").on(table.resourceId),
        index("idx_reports_status").on(table.status),
    ]
);

// Append-only history of every approve/reject/remove decision made on a resource -
// resourcesTable.moderatedBy/moderationReason/moderationNote/moderatedAt only ever
// hold the latest one of these, kept as a quick-access copy for existing read paths
// (My Uploads, the resource detail page) so nothing has to change there; this table is
// the actual source of truth if you ever need the full history (e.g. a resource that
// was rejected, resubmitted, then rejected again).
export const moderationActionsTable = pgTable("moderation_actions", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    resourceId: integer("resource_id")
        .references(() => resourcesTable.id, { onDelete: "cascade" })
        .notNull(),
    actorId: integer("actor_id")
        .references(() => usersTable.id, { onDelete: "set null" }),
    action: ModerationActionEnum("action").notNull(),
    reason: ModerationReasonEnum("reason"),
    note: text("note"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
},
    (table) => [
        index("idx_moderation_actions_resource_id").on(table.resourceId),
    ]
);

// Append-only history of USER <-> MODERATOR role changes made through the admin role
// endpoint. Granting/revoking ADMIN itself never goes through that endpoint (always a
// direct database change), so it never shows up here either.
export const roleChangesTable = pgTable("role_changes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .references(() => usersTable.id, { onDelete: "cascade" })
        .notNull(),
    changedBy: integer("changed_by")
        .references(() => usersTable.id, { onDelete: "set null" }),
    previousRole: UserRoleEnum("previous_role").notNull(),
    newRole: UserRoleEnum("new_role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
},
    (table) => [
        index("idx_role_changes_user_id").on(table.userId),
    ]
);


// Relations
export const programRelations = relations(programsTable, ({ many }) => ({
    subjects: many(subjectsTable),
    subjectOfferings: many(subjectOfferingsTable),
}))

export const subjectRelations = relations(subjectsTable, ({ many, one }) => ({
    program: one(programsTable, {
        fields: [subjectsTable.programId],
        references: [programsTable.id]
    }),
    subjectOfferings: many(subjectOfferingsTable),
    marks: one(marksTable, {
        fields: [subjectsTable.id],
        references: [marksTable.subjectId]
    }),
    resources: many(resourcesTable),
}));

export const subjectOfferingRelations = relations(subjectOfferingsTable, ({ one }) => ({
    subject: one(subjectsTable, {
        fields: [subjectOfferingsTable.subjectId],
        references: [subjectsTable.id]
    }),
    program: one(programsTable, {
        fields: [subjectOfferingsTable.programId],
        references: [programsTable.id]
    }),
}));

export const userRelations = relations(usersTable, ({ one, many }) => ({
    profile: one(profilesTable),
    // resourcesTable has two FKs to usersTable (uploadedBy, moderatedBy), and
    // reportsTable/roleChangesTable each have two as well (reportedBy/resolvedBy,
    // userId/changedBy) - relationName pairs disambiguate which "one" on the other
    // side each of these corresponds to.
    resources: many(resourcesTable, { relationName: "uploadedResources" }),
    moderatedResources: many(resourcesTable, { relationName: "moderatedResources" }),
    recentResources: many(userRecentResourcesTable),
    bookmarkedResources: many(userBookmarkedResourcesTable),
    reportsFiled: many(reportsTable, { relationName: "reportsFiled" }),
    reportsResolved: many(reportsTable, { relationName: "reportsResolved" }),
    moderationActions: many(moderationActionsTable),
    roleChangesReceived: many(roleChangesTable, { relationName: "roleChangeSubject" }),
    roleChangesPerformed: many(roleChangesTable, { relationName: "roleChangeActor" }),
}));

export const profileRelations = relations(profilesTable, ({ one }) => ({
    program: one(programsTable, {
        fields: [profilesTable.programId],
        references: [programsTable.id]
    }),
    user: one(usersTable, {
        fields: [profilesTable.userId],
        references: [usersTable.id]
    }),
}));

export const resourceRelations = relations(resourcesTable, ({ one, many }) => ({
    subjectOffering: one(subjectOfferingsTable, {
        fields: [resourcesTable.offeringId],
        references: [subjectOfferingsTable.id]
    }),
    uploader: one(usersTable, {
        fields: [resourcesTable.uploadedBy],
        references: [usersTable.id],
        relationName: "uploadedResources",
    }),
    moderator: one(usersTable, {
        fields: [resourcesTable.moderatedBy],
        references: [usersTable.id],
        relationName: "moderatedResources",
    }),
    files: many(resourceFilesTable),
    reports: many(reportsTable),
    moderationActions: many(moderationActionsTable),
}));

export const resourceFileRelations = relations(resourceFilesTable, ({ one }) => ({
    resource: one(resourcesTable, {
        fields: [resourceFilesTable.resourceId],
        references: [resourcesTable.id]
    }),
}));

export const userRecentResourceRelations = relations(userRecentResourcesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userRecentResourcesTable.userId],
        references: [usersTable.id]
    }),
    resource: one(resourcesTable, {
        fields: [userRecentResourcesTable.resourceId],
        references: [resourcesTable.id]
    }),
}));

export const userBookmarkedResourceRelations = relations(userBookmarkedResourcesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [userBookmarkedResourcesTable.userId],
        references: [usersTable.id]
    }),
    resource: one(resourcesTable, {
        fields: [userBookmarkedResourcesTable.resourceId],
        references: [resourcesTable.id]
    }),
}));

export const reportRelations = relations(reportsTable, ({ one }) => ({
    resource: one(resourcesTable, {
        fields: [reportsTable.resourceId],
        references: [resourcesTable.id]
    }),
    reporter: one(usersTable, {
        fields: [reportsTable.reportedBy],
        references: [usersTable.id],
        relationName: "reportsFiled",
    }),
    resolver: one(usersTable, {
        fields: [reportsTable.resolvedBy],
        references: [usersTable.id],
        relationName: "reportsResolved",
    }),
}));

export const moderationActionRelations = relations(moderationActionsTable, ({ one }) => ({
    resource: one(resourcesTable, {
        fields: [moderationActionsTable.resourceId],
        references: [resourcesTable.id]
    }),
    actor: one(usersTable, {
        fields: [moderationActionsTable.actorId],
        references: [usersTable.id]
    }),
}));

export const roleChangeRelations = relations(roleChangesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [roleChangesTable.userId],
        references: [usersTable.id],
        relationName: "roleChangeSubject",
    }),
    changedByUser: one(usersTable, {
        fields: [roleChangesTable.changedBy],
        references: [usersTable.id],
        relationName: "roleChangeActor",
    }),
}));
