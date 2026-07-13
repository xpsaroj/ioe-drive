import { Inject, Injectable } from "@nestjs/common";
import { and, asc, count, eq } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import {
  moderationActionsTable,
  reportsTable,
  resourceFilesTable,
  resourcesTable,
  type ModerationAction,
  type ModerationReason,
} from "../../database/schema";
import { RESOURCE_DETAIL_RELATIONS, RESOURCE_PREVIEW_RELATIONS } from "../resources/resources.repository";
import type { ModerateResourceData } from "../resources/resources.types";

@Injectable()
export class ModerationRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  /** Just enough to authorize + drive a moderation action: current status (to reject
   * an approve/reject/remove on a resource that isn't in an actionable state) and
   * every attached file's blob name (so `remove` can purge them from Azure). */
  findForModeration(resourceId: number) {
    return this.db.query.resourcesTable.findFirst({
      where: eq(resourcesTable.id, resourceId),
      columns: { id: true, status: true, uploadedBy: true },
      with: { files: { columns: { blobName: true } } },
    });
  }

  async findPending(pagination: { limit: number; offset: number }) {
    const whereClause = eq(resourcesTable.status, "PENDING");

    const [items, totalResult] = await Promise.all([
      this.db.query.resourcesTable.findMany({
        where: whereClause,
        orderBy: [asc(resourcesTable.createdAt)],
        limit: pagination.limit,
        offset: pagination.offset,
        with: RESOURCE_DETAIL_RELATIONS,
      }),
      this.db.select({ total: count() }).from(resourcesTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }

  /** Updates a resource's status/moderation fields and appends a row to
   * moderation_actions in the same transaction, so the two can never drift apart -
   * resourcesTable's moderation fields are just a quick-access copy of this newest
   * row, not a separate source of truth (see moderationActionsTable in schema.ts). */
  async recordModerationAction(resourceId: number, action: ModerationAction, data: ModerateResourceData) {
    return this.db.transaction(async (tx) => {
      const [updatedResource] = await tx
        .update(resourcesTable)
        .set(data)
        .where(eq(resourcesTable.id, resourceId))
        .returning();

      await tx.insert(moderationActionsTable).values({
        resourceId,
        actorId: data.moderatedBy,
        action,
        reason: data.moderationReason,
        note: data.moderationNote,
      });

      return updatedResource;
    });
  }

  async deleteResourceFiles(resourceId: number): Promise<void> {
    await this.db.delete(resourceFilesTable).where(eq(resourceFilesTable.resourceId, resourceId));
  }

  findExistingReport(resourceId: number, reportedBy: number) {
    return this.db.query.reportsTable.findFirst({
      where: and(eq(reportsTable.resourceId, resourceId), eq(reportsTable.reportedBy, reportedBy)),
      columns: { id: true },
    });
  }

  async createReport(data: { resourceId: number; reportedBy: number; reason: ModerationReason; note?: string }) {
    const [createdReport] = await this.db.insert(reportsTable).values(data).returning();

    return createdReport;
  }

  async findOpenReports(pagination: { limit: number; offset: number }) {
    const whereClause = eq(reportsTable.status, "OPEN");

    const [items, totalResult] = await Promise.all([
      this.db.query.reportsTable.findMany({
        where: whereClause,
        orderBy: [asc(reportsTable.createdAt)],
        limit: pagination.limit,
        offset: pagination.offset,
        with: {
          resource: { columns: { id: true, title: true, type: true }, with: RESOURCE_PREVIEW_RELATIONS },
          reporter: { columns: { id: true, fullName: true } },
        },
      }),
      this.db.select({ total: count() }).from(reportsTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }

  /** Marks every still-OPEN report against a resource RESOLVED - called when a
   * moderator rejects/removes a resource, since that action already addresses whatever
   * any pending reports on it were about. */
  async resolveReportsForResource(resourceId: number, resolvedBy: number): Promise<void> {
    await this.db
      .update(reportsTable)
      .set({ status: "RESOLVED", resolvedAt: new Date(), resolvedBy })
      .where(and(eq(reportsTable.resourceId, resourceId), eq(reportsTable.status, "OPEN")));
  }

  async resolveReport(reportId: number, resolvedBy: number) {
    const [resolvedReport] = await this.db
      .update(reportsTable)
      .set({ status: "RESOLVED", resolvedAt: new Date(), resolvedBy })
      .where(and(eq(reportsTable.id, reportId), eq(reportsTable.status, "OPEN")))
      .returning();

    return resolvedReport;
  }
}
