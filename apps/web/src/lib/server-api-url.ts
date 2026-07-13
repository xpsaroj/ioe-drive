/** Base API URL for server-only code (generateMetadata, sitemap.ts, robots.ts) - never
 * imported by client components. `NEXT_PUBLIC_API_BASE_URL` is correct for the browser,
 * but inside Docker Compose "localhost" from the web container doesn't reach the server
 * container - `API_INTERNAL_URL` (set to the server's Docker service name) is Compose's
 * override for exactly that. Outside Docker, both point at the same localhost address,
 * so this falls back to the public one. */
export const SERVER_API_BASE_URL =
    process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";
