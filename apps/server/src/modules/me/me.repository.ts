import { Inject, Injectable } from "@nestjs/common";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";

import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { resourcesTable, resourceVotesTable, userBookmarkedResourcesTable, userRecentResourcesTable } from "../../database/schema";
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

  async findVoteValues(userId: number): Promise<Record<number, number>> {
    const rows = await this.db.query.resourceVotesTable.findMany({
      where: eq(resourceVotesTable.userId, userId),
      columns: { resourceId: true, value: true },
    });

    return Object.fromEntries(rows.map((row) => [row.resourceId, row.value]));
  }

  async setVote(userId: number, resourceId: number, value: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      const existing = await tx.query.resourceVotesTable.findFirst({
        where: and(eq(resourceVotesTable.userId, userId), eq(resourceVotesTable.resourceId, resourceId)),
        columns: { value: true },
      });

      if (existing?.value === value) return;

      await tx
        .insert(resourceVotesTable)
        .values({ userId, resourceId, value })
        .onConflictDoUpdate({
          target: [resourceVotesTable.userId, resourceVotesTable.resourceId],
          set: { value, updatedAt: new Date() },
        });

      const upvoteDelta = (value === 1 ? 1 : 0) - (existing?.value === 1 ? 1 : 0);
      const downvoteDelta = (value === -1 ? 1 : 0) - (existing?.value === -1 ? 1 : 0);

      await tx
        .update(resourcesTable)
        .set({
          upvoteCount: sql`${resourcesTable.upvoteCount} + ${upvoteDelta}`,
          downvoteCount: sql`${resourcesTable.downvoteCount} + ${downvoteDelta}`,
        })
        .where(eq(resourcesTable.id, resourceId));
    });
  }

  async clearVote(userId: number, resourceId: number): Promise<void> {
    await this.db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(resourceVotesTable)
        .where(and(eq(resourceVotesTable.userId, userId), eq(resourceVotesTable.resourceId, resourceId)))
        .returning({ value: resourceVotesTable.value });

      if (!deleted) return;

      await tx
        .update(resourcesTable)
        .set({
          upvoteCount: sql`${resourcesTable.upvoteCount} - ${deleted.value === 1 ? 1 : 0}`,
          downvoteCount: sql`${resourcesTable.downvoteCount} - ${deleted.value === -1 ? 1 : 0}`,
        })
        .where(eq(resourcesTable.id, resourceId));
    });
  }
}
