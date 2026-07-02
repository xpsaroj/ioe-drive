import { readFileSync } from "node:fs";

import { db } from "../index.js";

import {
    programsTable,
    subjectsTable,
    marksTable,
    subjectOfferingsTable,
    type Semester,
    type Year,
} from "../schema.js";

type SubjectsJsonEntry = {
    code: string;
    name: string;
    programCode: string;
    syllabusUrl?: string;
    marks: {
        theoryAssessment?: number;
        theoryFinal?: number;
        practicalAssessment?: number;
        practicalFinal?: number;
    };
};

type SubjectOfferingsJson = {
    [programCode: string]: {
        name: string;
        subjects: {
            code: string;
            name: string;
            year: Year;
            semester: Semester;
            programCode: string;
            isElective?: boolean;
        }[];
    };
}

async function seedSubjectsAndOfferings() {
    try {
        // Read JSON files
        const subjectsJson: SubjectsJsonEntry[] = JSON.parse(
            readFileSync("data/subjects.json", "utf-8")
        );

        const offeringsJson: SubjectOfferingsJson = JSON.parse(
            readFileSync("data/subject-offerings.json", "utf-8")
        );

        // Fetch all programs to create a mapping of programCode -> programId
        const programs = await db.select().from(programsTable);

        const programCodeToId = new Map<string, number>();
        programs.forEach((p) => {
            programCodeToId.set(p.code, p.id);
        });

        // Insert subjects and keep track of their IDs for later use in offerings and marks
        const subjectCodeToId = new Map<string, number>();

        for (const subject of subjectsJson) {
            const programId = programCodeToId.get(subject.programCode);

            if (!programId) {
                console.warn(`Program not found for ${subject.programCode}`);
                continue;
            }

            const inserted = await db
                .insert(subjectsTable)
                .values({
                    code: subject.code,
                    name: subject.name,
                    programId,
                    syllabusUrl: subject.syllabusUrl ?? null,
                    hardnessLevel: "MEDIUM", // default to MEDIUM
                })
                .onConflictDoNothing()
                .returning({ id: subjectsTable.id, code: subjectsTable.code });

            if (inserted.length > 0 && inserted[0]) {
                subjectCodeToId.set(inserted[0].code, inserted[0].id);
            }
        }

        // Fetch all subjects again to ensure we have the IDs for all subjects (including those that were not inserted due to conflicts)
        const allSubjects = await db.select().from(subjectsTable);

        allSubjects.forEach((s) => {
            subjectCodeToId.set(s.code, s.id);
        });

        // Insert marks for each subject
        for (const subject of subjectsJson) {
            const subjectId = subjectCodeToId.get(subject.code);
            if (!subjectId) continue;

            await db
                .insert(marksTable)
                .values({
                    subjectId,
                    theoryAssessment: subject.marks.theoryAssessment ?? 0,
                    theoryFinal: subject.marks.theoryFinal ?? 0,
                    practicalAssessment: subject.marks.practicalAssessment ?? 0,
                    practicalFinal: subject.marks.practicalFinal ?? 0,
                })
                .onConflictDoNothing();
        }

        // Insert subject offerings
        for (const programCode in offeringsJson) {
            const programData = offeringsJson[programCode];
            const programId = programCodeToId.get(programCode);

            if (!programId) continue;

            const subjectsForProgram = programData?.subjects || [];
            for (const offering of subjectsForProgram) {
                const subjectId = subjectCodeToId.get(offering.code);

                if (!subjectId) {
                    console.warn(`Subject not found for offering: ${offering.code}`);
                    continue;
                }

                await db
                    .insert(subjectOfferingsTable)
                    .values({
                        subjectId,
                        programId,
                        semester: offering.semester,
                        year: offering.year,
                        isElective: offering.isElective ?? false,
                    })
                    .onConflictDoNothing();
            }
        }

        console.log("Subjects, marks and offerings seeded successfully.");
    } catch (error) {
        console.error("Seeding failed:", error);
    }
}

await seedSubjectsAndOfferings();
process.exit(0);