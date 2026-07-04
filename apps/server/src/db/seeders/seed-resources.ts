import { randomUUID } from "node:crypto";

import { eq, ne } from "drizzle-orm";

import { db } from "../index.js";
import {
    usersTable,
    programsTable,
    subjectsTable,
    subjectOfferingsTable,
    ResourceTypeEnum,
    type ResourceType,
} from "../schema.js";
import { resourcesRepository } from "../../modules/resources/resources.repository.js";
import type { FileMetaData } from "../../types/file.js";

/**
 * How many resources to create for the one chosen subject in each program/semester.
 */
const RESOURCES_PER_SUBJECT = 5;

/**
 * How many (fake) files to attach to each seeded resource.
 */
const FILES_PER_RESOURCE = 5;

/**
 * Human-friendly label per resource type, used to build placeholder titles/descriptions.
 */
const RESOURCE_TYPE_LABEL: Record<ResourceType, string> = {
    NOTE: "Notes",
    PAST_QUESTION: "Past Question",
    ASSESSMENT: "Assessment",
    LAB_SHEET: "Lab Sheet",
    BOOK: "Reference Book",
    OTHER: "Resource",
};

/**
 * Rotating set of MIME types (and matching extensions) used to fake out file variety.
 * These are not uploaded anywhere - the URL below is a placeholder, not a real blob.
 */
const FAKE_FILE_TYPES: { mimeType: string; ext: string }[] = [
    { mimeType: "application/pdf", ext: "pdf" },
    { mimeType: "image/jpeg", ext: "jpg" },
    { mimeType: "image/png", ext: "png" },
    { mimeType: "application/msword", ext: "doc" },
    { mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: "docx" },
];

/**
 * A subject offering, joined with its subject's code/name, used to build a readable
 * resource title (e.g. "ENCE 201 Notes") and grouped later by program + semester.
 */
type OfferingWithSubject = {
    id: number;
    programId: number;
    semester: string;
    subjectCode: string;
    subjectName: string;
};

/**
 * Builds a fake file entry for a resource. No network/storage calls are made here -
 * `url` is a placeholder string, not a real Azure Blob Storage location.
 */
function createFakeFile(subjectCode: string, resourceIndex: number, fileIndex: number): FileMetaData {
    const { mimeType, ext } = FAKE_FILE_TYPES[fileIndex % FAKE_FILE_TYPES.length]!;
    const blobName = `${randomUUID()}.${ext}`;

    return {
        blobName,
        url: `https://placeholder.local/resources/${blobName}`,
        originalName: `${subjectCode}-${resourceIndex + 1}-${fileIndex + 1}.${ext}`,
        mimeType,
        // Plausible-looking size, not tied to any real file
        size: (fileIndex + 1) * 128 * 1024,
    };
}

/**
 * Seed sample resources for local development/testing.
 *
 * For every program except SH (SH is a service department, not a program students are
 * actually enrolled in - see schema.ts), and for every semester that program offers,
 * exactly one subject is chosen (the first offering found for that program/semester) and
 * given `RESOURCES_PER_SUBJECT` resources, each with `FILES_PER_RESOURCE` fake files.
 * This intentionally does NOT seed every subject - doing that for all programs/semesters
 * would be a huge amount of data for a seed script.
 *
 * No files are uploaded to Azure Blob Storage - `resource_files` rows are inserted with
 * placeholder data (fake blob names/URLs/sizes) purely so the resource list/detail pages
 * and per-user views have something to render locally.
 *
 * Requires at least one user in the `users` table (synced via `db:sync-clerk-users` or
 * created through the Clerk webhook) and at least one subject offering (seeded via
 * `db:seed-subjects`). If either is missing, the script logs why and exits without
 * creating anything. This script does not check for previously seeded resources - it
 * assumes you're starting from a clean `resources` table.
 */
async function seedResources() {
    try {
        // Resources must be attributed to an uploader, so there's nothing to do without users
        const users = await db.select().from(usersTable);

        if (users.length === 0) {
            console.log("No users found in the database. Run db:sync-clerk-users first, or sign up a user. Skipping resource seeding.");
            return;
        }

        // All real (student-enrolled) programs - SH is a service department, not a program
        const programs = await db
            .select({ id: programsTable.id, code: programsTable.code })
            .from(programsTable)
            .where(ne(programsTable.code, "SH"));

        if (programs.length === 0) {
            console.log("No programs found. Run db:seed-programs first. Skipping resource seeding.");
            return;
        }

        const programIds = new Set(programs.map((program) => program.id));

        // All offerings across all (non-SH) programs, joined with their subject for a readable title
        const allOfferings: OfferingWithSubject[] = await db
            .select({
                id: subjectOfferingsTable.id,
                programId: subjectOfferingsTable.programId,
                semester: subjectOfferingsTable.semester,
                subjectCode: subjectsTable.code,
                subjectName: subjectsTable.name,
            })
            .from(subjectOfferingsTable)
            .innerJoin(subjectsTable, eq(subjectOfferingsTable.subjectId, subjectsTable.id))
            .orderBy(subjectOfferingsTable.id);

        if (allOfferings.length === 0) {
            console.log("No subject offerings found. Run db:seed-subjects first. Skipping resource seeding.");
            return;
        }

        // Pick exactly one offering per (program, semester) pair - the first one encountered,
        // since allOfferings is already ordered by id.
        const chosenOfferings = new Map<string, OfferingWithSubject>();
        for (const offering of allOfferings) {
            if (!programIds.has(offering.programId)) continue;

            const key = `${offering.programId}-${offering.semester}`;
            if (!chosenOfferings.has(key)) {
                chosenOfferings.set(key, offering);
            }
        }

        let uploaderCursor = 0;

        for (const offering of chosenOfferings.values()) {
            for (let i = 0; i < RESOURCES_PER_SUBJECT; i++) {
                // Cycle through users so resources aren't all attributed to one person
                const uploader = users[uploaderCursor % users.length]!;
                uploaderCursor++;

                // Cycle through resource types so the 5 resources for a subject aren't all the same kind
                const type = ResourceTypeEnum.enumValues[i % ResourceTypeEnum.enumValues.length]!;
                const typeLabel = RESOURCE_TYPE_LABEL[type];

                const files = Array.from({ length: FILES_PER_RESOURCE }, (_, fileIndex) =>
                    createFakeFile(offering.subjectCode, i, fileIndex)
                );

                await resourcesRepository.create(
                    {
                        title: `${offering.subjectCode} ${typeLabel}`,
                        description: `Sample ${typeLabel.toLowerCase()} for ${offering.subjectName}, shared by ${uploader.fullName}.`,
                        type,
                        offeringId: offering.id,
                        uploadedBy: uploader.id,
                    },
                    files
                );
            }

            console.log(`Seeded ${RESOURCES_PER_SUBJECT} resource(s) for ${offering.subjectCode} (program ${offering.programId}, semester ${offering.semester}).`);
        }

        console.log("Resources seeded successfully.");
    } catch (error) {
        console.error("Error seeding resources:", error);
    }
}

await seedResources();
process.exit(0);
