import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";

import { CLERK_CLIENT, type ClerkClient } from "../../clerk/clerk.constants";
import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { usersTable } from "../../database/schema";
import { toFetchRequest } from "../utils/fetch-request";
import type { RequestWithAuthUser } from "./clerk-auth.guard";

/**
 * Same identity resolution as ClerkAuthGuard, but never rejects the request - populates
 * `request.authUser` when a valid session exists, leaves it undefined otherwise. For
 * routes that are public but behave differently depending on who's asking (e.g. a
 * resource pending review is visible to its uploader/a moderator, 404 for anyone else),
 * rather than being either fully public or fully gated.
 */
@Injectable()
export class OptionalClerkAuthGuard implements CanActivate {
  constructor(
    @Inject(CLERK_CLIENT) private readonly clerkClient: ClerkClient,
    @Inject(DRIZZLE) private readonly db: DrizzleDb,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthUser>();

    const authorizedParties = this.configService
      .getOrThrow<string>("ALLOWED_ORIGINS")
      .split(",")
      .map((origin) => origin.trim());

    const requestState = await this.clerkClient.authenticateRequest(toFetchRequest(request), {
      authorizedParties,
    });

    if (!requestState.isAuthenticated) {
      return true;
    }

    const { userId: clerkUserId } = requestState.toAuth();

    const user = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.clerkUserId, clerkUserId),
      columns: { id: true, clerkUserId: true, role: true },
    });

    request.authUser = user ?? undefined;
    return true;
  }
}
