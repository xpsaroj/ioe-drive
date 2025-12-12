import { eq } from "drizzle-orm";

import { webhookEventsTable } from "../db/schema.js";
import { db } from "../db/index.js";

/**
 * Helper: Check if webhook event has already been processed
 */
export async function alreadyProcessed(svixId: string) {
    const rows = await db
        .select()
        .from(webhookEventsTable)
        .where(eq(webhookEventsTable.svixId, svixId));
    return rows.length > 0;
}

/**
 * Helper: Mark webhook event as processed
 */
export async function markProcessed(svixId: string, type: string) {
    await db.insert(webhookEventsTable).values({ svixId, eventType: type });
}
