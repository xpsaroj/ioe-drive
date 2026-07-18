import { Inject, Injectable } from "@nestjs/common";
import { and, asc, count, eq } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import {
  marketplaceListingPhotosTable,
  marketplaceListingsTable,
  marketplaceReportsTable,
  moderationActionsTable,
  reportsTable,
  resourceFilesTable,
  resourcesTable,
  type MarketplaceReportReason,
  type ModerationAction,
  type ModerationReason,
} from "../../database/schema";
import { RESOURCE_DETAIL_RELATIONS, RESOURCE_PREVIEW_RELATIONS } from "../resources/resources.repository";
import type { ModerateResourceData } from "../resources/resources.types";
import type { ModerateListingData } from "../marketplace/marketplace-listing.types";

@Injectable()
export class ModerationRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  // Just enough to authorize + drive a moderation action: status, file blob names for `remove`
  // to purge, and title (for the notification message ModerationService builds afterward).
  findForResourceModeration(resourceId: number) {
    return this.db.query.resourcesTable.findFirst({
      where: eq(resourcesTable.id, resourceId),
      columns: { id: true, status: true, uploadedBy: true, title: true },
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

  // Same transaction as the moderation_actions insert, so the two can never drift apart.
  async recordResourceModerationAction(resourceId: number, action: ModerationAction, data: ModerateResourceData) {
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

  findExistingResourceReport(resourceId: number, reportedBy: number) {
    return this.db.query.reportsTable.findFirst({
      where: and(eq(reportsTable.resourceId, resourceId), eq(reportsTable.reportedBy, reportedBy)),
      columns: { id: true },
    });
  }

  async createResourceReport(data: { resourceId: number; reportedBy: number; reason: ModerationReason; note?: string }) {
    const [createdReport] = await this.db.insert(reportsTable).values(data).returning();

    return createdReport;
  }

  async findOpenResourceReports(pagination: { limit: number; offset: number }) {
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

  // Called when a moderator rejects/removes a resource - that action already addresses any open reports.
  async resolveReportsForResource(resourceId: number, resolvedBy: number): Promise<void> {
    await this.db
      .update(reportsTable)
      .set({ status: "RESOLVED", resolvedAt: new Date(), resolvedBy })
      .where(and(eq(reportsTable.resourceId, resourceId), eq(reportsTable.status, "OPEN")));
  }

  async resolveResourceReport(reportId: number, resolvedBy: number) {
    const [resolvedReport] = await this.db
      .update(reportsTable)
      .set({ status: "RESOLVED", resolvedAt: new Date(), resolvedBy })
      .where(and(eq(reportsTable.id, reportId), eq(reportsTable.status, "OPEN")))
      .returning();

    return resolvedReport;
  }

  // Just enough to authorize + drive a moderation action: status, photo blob names for `remove`
  // to purge, and title (for the notification message ModerationService builds afterward).
  findForListingModeration(listingId: number) {
    return this.db.query.marketplaceListingsTable.findFirst({
      where: eq(marketplaceListingsTable.id, listingId),
      columns: { id: true, status: true, postedBy: true, title: true },
      with: { photos: { columns: { blobName: true } } },
    });
  }

  // No separate audit table for marketplace listings - REMOVE is the only action and it's terminal, so these denormalized columns are a complete record.
  async recordMarketplaceModerationAction(listingId: number, data: ModerateListingData) {
    const [updatedListing] = await this.db
      .update(marketplaceListingsTable)
      .set(data)
      .where(eq(marketplaceListingsTable.id, listingId))
      .returning();

    return updatedListing;
  }

  async deleteListingPhotos(listingId: number): Promise<void> {
    await this.db.delete(marketplaceListingPhotosTable).where(eq(marketplaceListingPhotosTable.listingId, listingId));
  }

  findExistingMarketplaceReport(listingId: number, reportedBy: number) {
    return this.db.query.marketplaceReportsTable.findFirst({
      where: and(eq(marketplaceReportsTable.listingId, listingId), eq(marketplaceReportsTable.reportedBy, reportedBy)),
      columns: { id: true },
    });
  }

  async createMarketplaceReport(data: { listingId: number; reportedBy: number; reason: MarketplaceReportReason; note?: string }) {
    const [createdReport] = await this.db.insert(marketplaceReportsTable).values(data).returning();

    return createdReport;
  }

  async findOpenMarketplaceReports(pagination: { limit: number; offset: number }) {
    const whereClause = eq(marketplaceReportsTable.status, "OPEN");

    const [items, totalResult] = await Promise.all([
      this.db.query.marketplaceReportsTable.findMany({
        where: whereClause,
        orderBy: [asc(marketplaceReportsTable.createdAt)],
        limit: pagination.limit,
        offset: pagination.offset,
        with: {
          listing: { columns: { id: true, title: true, type: true, category: true } },
          reporter: { columns: { id: true, fullName: true } },
        },
      }),
      this.db.select({ total: count() }).from(marketplaceReportsTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }

  // Called when a moderator removes a listing - that action already addresses any open reports.
  async resolveMarketplaceReportsForListing(listingId: number, resolvedBy: number): Promise<void> {
    await this.db
      .update(marketplaceReportsTable)
      .set({ status: "RESOLVED", resolvedAt: new Date(), resolvedBy })
      .where(and(eq(marketplaceReportsTable.listingId, listingId), eq(marketplaceReportsTable.status, "OPEN")));
  }

  async resolveMarketplaceReport(reportId: number, resolvedBy: number) {
    const [resolvedReport] = await this.db
      .update(marketplaceReportsTable)
      .set({ status: "RESOLVED", resolvedAt: new Date(), resolvedBy })
      .where(and(eq(marketplaceReportsTable.id, reportId), eq(marketplaceReportsTable.status, "OPEN")))
      .returning();

    return resolvedReport;
  }
}
