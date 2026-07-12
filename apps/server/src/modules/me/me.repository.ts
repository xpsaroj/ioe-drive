import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq, inArray } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { resourcesTable, userBookmarkedResourcesTable, userRecentResourcesTable } from "../../database/schema";
import { RESOURCE_DETAIL_RELATIONS } from "../resources/resources.repository";

@Injectable()
export class MeRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  /** Used to exclude resources that are no longer publicly visible (pending/rejected/
   * removed) from another user's recent/bookmarked lists - a subquery rather than a
   * nested relation filter, so it narrows the join-table rows themselves and keeps
   * pagination/total counts correct instead of just nulling out `.resource`. */
  private approvedResourceIdsSubquery() {
    return this.db.select({ id: resourcesTable.id }).from(resourcesTable).where(eq(resourcesTable.status, "APPROVED"));
  }

  async findRecentResources(userId: number, pagination: { limit: number; offset: number }) {
    const whereClause = and(
      eq(userRecentResourcesTable.userId, userId),
      inArray(userRecentResourcesTable.resourceId, this.approvedResourceIdsSubquery()),
    );

    const [items, totalResult] = await Promise.all([
      this.db.query.userRecentResourcesTable.findMany({
        where: whereClause,
        with: { resource: { with: RESOURCE_DETAIL_RELATIONS } },
        orderBy: [desc(userRecentResourcesTable.accessedAt)],
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db.select({ total: count() }).from(userRecentResourcesTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }

  async findBookmarkedResources(userId: number, pagination: { limit: number; offset: number }) {
    const whereClause = and(
      eq(userBookmarkedResourcesTable.userId, userId),
      inArray(userBookmarkedResourcesTable.resourceId, this.approvedResourceIdsSubquery()),
    );

    const [items, totalResult] = await Promise.all([
      this.db.query.userBookmarkedResourcesTable.findMany({
        where: whereClause,
        with: { resource: { with: RESOURCE_DETAIL_RELATIONS } },
        orderBy: [desc(userBookmarkedResourcesTable.bookmarkedAt)],
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db.select({ total: count() }).from(userBookmarkedResourcesTable).where(whereClause),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }

  async findBookmarkedResourceIds(userId: number): Promise<number[]> {
    const rows = await this.db.query.userBookmarkedResourcesTable.findMany({
      where: eq(userBookmarkedResourcesTable.userId, userId),
      columns: { resourceId: true },
    });

    return rows.map((row) => row.resourceId);
  }

  async markRecentlyAccessed(userId: number, resourceId: number): Promise<void> {
    const now = new Date();

    await this.db
      .insert(userRecentResourcesTable)
      .values({ userId, resourceId, accessedAt: now })
      .onConflictDoUpdate({
        target: [userRecentResourcesTable.userId, userRecentResourcesTable.resourceId],
        set: { accessedAt: now },
      });
  }

  async markBookmarked(userId: number, resourceId: number): Promise<void> {
    await this.db
      .insert(userBookmarkedResourcesTable)
      .values({ userId, resourceId, bookmarkedAt: new Date() })
      .onConflictDoNothing();
  }

  async unmarkBookmarked(userId: number, resourceId: number): Promise<void> {
    await this.db
      .delete(userBookmarkedResourcesTable)
      .where(
        and(
          eq(userBookmarkedResourcesTable.userId, userId),
          eq(userBookmarkedResourcesTable.resourceId, resourceId),
        ),
      );
  }
}
