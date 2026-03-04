import { readFileSync } from "node:fs";

import { db } from "../index.js";
import { programsTable } from "../schema.js";

type Program = {
    code: string;
    name: string;
    totalYears: number;
    syllabusUrl?: string;
}

async function seedPrograms() {
    try {
        const programs: Program[] = JSON.parse(readFileSync("data/programs.json", {
            encoding: "utf-8",
        }));

        await db
            .insert(programsTable)
            .values(programs)
            .onConflictDoNothing();
        console.log("Programs seeded successfully.");
    } catch (error) {
        console.error("Error seeding programs:", error);
        return;
    }
}

await seedPrograms();
process.exit(0);