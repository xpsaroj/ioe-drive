import { SetMetadata } from "@nestjs/common";

import type { UserRole } from "../../database/schema";

export const ROLES_KEY = "roles";

/** Marks a route as requiring one of the given roles - read by RolesGuard. Must be
 * paired with @UseGuards(ClerkAuthGuard, RolesGuard), in that order, since RolesGuard
 * relies on ClerkAuthGuard having already attached `request.authUser`. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
