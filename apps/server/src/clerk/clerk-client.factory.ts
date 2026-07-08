import { createClerkClient } from "@clerk/backend";

/**
 * Builds the Clerk backend client. Shared by ClerkModule's Nest provider and the
 * standalone sync-clerk-users seeder script (which runs outside Nest's DI container).
 */
export function buildClerkClient(secretKey: string, publishableKey: string) {
  return createClerkClient({ secretKey, publishableKey });
}
