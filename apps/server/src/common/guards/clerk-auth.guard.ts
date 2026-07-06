import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { eq } from "drizzle-orm";
import type { Request } from "express";

import { CLERK_CLIENT, type ClerkClient } from "../../clerk/clerk.constants";
import { DRIZZLE } from "../../database/database.constants";
import type { DrizzleDb } from "../../database/database.types";
import { usersTable } from "../../database/schema";
import { toFetchRequest } from "../utils/fetch-request";

export interface AuthenticatedUser {
  id: number;
  clerkUserId: string;
}

export type RequestWithAuthUser = Request & { authUser?: AuthenticatedUser };

/**
 * Verifies the Clerk session via @clerk/backend, then requires a matching row in the
 * local `users` table (rejecting as unauthorized even if Clerk itself considers the
 * request signed in - the local table must be kept in sync via the webhook for auth
 * to work end to end).
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
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
      throw new UnauthorizedException("User not authenticated");
    }

    const { userId: clerkUserId } = requestState.toAuth();

    const user = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.clerkUserId, clerkUserId),
      columns: { id: true, clerkUserId: true },
    });

    if (!user) {
      throw new UnauthorizedException("User not registered in database");
    }

    request.authUser = user;
    return true;
  }
}
