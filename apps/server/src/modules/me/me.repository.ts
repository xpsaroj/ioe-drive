import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { userBookmarkedResourcesTable, userRecentResourcesTable } from "../../database/schema";
import { RESOURCE_DETAIL_RELATIONS } from "../resources/resources.repository";

@Injectable()
export class MeRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDb) {}

  async findRecentResources(userId: number, pagination: { limit: number; offset: number }) {
    const [items, totalResult] = await Promise.all([
      this.db.query.userRecentResourcesTable.findMany({
        where: eq(userRecentResourcesTable.userId, userId),
        with: { resource: { with: RESOURCE_DETAIL_RELATIONS } },
        orderBy: [desc(userRecentResourcesTable.accessedAt)],
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db
        .select({ total: count() })
        .from(userRecentResourcesTable)
        .where(eq(userRecentResourcesTable.userId, userId)),
    ]);

    return { items, total: totalResult[0]?.total ?? 0 };
  }

  async findBookmarkedResources(userId: number, pagination: { limit: number; offset: number }) {
    const [items, totalResult] = await Promise.all([
      this.db.query.userBookmarkedResourcesTable.findMany({
        where: eq(userBookmarkedResourcesTable.userId, userId),
        with: { resource: { with: RESOURCE_DETAIL_RELATIONS } },
        orderBy: [desc(userBookmarkedResourcesTable.bookmarkedAt)],
        limit: pagination.limit,
        offset: pagination.offset,
      }),
      this.db
        .select({ total: count() })
        .from(userBookmarkedResourcesTable)
        .where(eq(userBookmarkedResourcesTable.userId, userId)),
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
