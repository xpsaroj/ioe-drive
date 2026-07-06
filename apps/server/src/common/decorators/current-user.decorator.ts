import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { RequestWithAuthUser, AuthenticatedUser } from "../guards/clerk-auth.guard";

/**
 * Reads the local user attached by ClerkAuthGuard. Only valid on routes guarded by
 * @UseGuards(ClerkAuthGuard) - the guard always runs first and throws when
 * unauthenticated, so `authUser` is guaranteed to be set here.
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const request = ctx.switchToHttp().getRequest<RequestWithAuthUser>();
  return request.authUser!;
});
