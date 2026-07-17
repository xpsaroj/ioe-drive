# What's Done

A quick, high-level list of what already works. For the full picture see
`project-overview.md`; for what's next see `todo.md`.

- Monorepo scaffolding: Next.js 16 web app + NestJS 11 API, Docker Compose dev stack,
  per-app CI (lint, typecheck, build) plus a merge gatekeeper and a deploy workflow.
- Full Postgres schema (Drizzle): programs, subjects, subject offerings, marks, users,
  profiles, resources + files, recently-accessed and bookmarked tracking, webhook
  idempotency.
- Seed data for all IOE engineering programs (plus the SH service department) and their
  new-syllabus subjects/offerings, keyed so seeders can be safely re-run. A separate
  `db:seed-resources` script seeds sample resources (with fake, non-Azure files) for one
  subject per semester per program, for local development/testing.
- Clerk authentication end to end: protected routes on the web app, a `ClerkAuthGuard`
  on the API, and a webhook that keeps a local `users`/`profiles` mirror in sync with
  Clerk.
- Resources generalized from the old "notes-only" model: DB tables, API routes
  (`/api/resources`, `/api/me/resources`, etc.), and frontend types/hooks/components all
  renamed to the generic "resource" concept, with a required `type` field (note, past
  question, assessment, lab sheet, book, other) and a data-preserving rename migration.
- Full resource CRUD: create/update/delete/list/detail, with multi-file upload straight
  to Azure Blob Storage, plus adding/removing individual files on an existing resource.
  Editing and deleting are only available to a resource's owner, enforced server-side.
  Resource listings (browse, uploader-filtered, "My Uploads") sort newest-first.
- Per-user "recently accessed" and "bookmarked" resource tracking (the old "archived"
  naming was renamed to "bookmarked" end to end, DB through UI). Visiting a resource's
  detail page or a file within it now actually marks it as recently accessed, ordered by
  last access. A bookmark toggle button now appears on every resource card and the detail
  page (any signed-in user, not just the uploader), backed by a bulk "bookmarked resource
  IDs" endpoint and optimistic UI updates.
- Pagination (`page`/`limit` query params, numbered-pages UI) on every list that grows
  unbounded: `/resources` browse, `/library/uploads`, `/library/bookmarks`,
  `/library/recent`, and another user's public uploads list. Shared on the backend via a
  `PaginationQueryDto` and response `meta`, and on the frontend via a shared
  `<Pagination>` component and URL-synced page state (`?page=`).
- Profile management: program, semester, college, bio, onboarding flow.
- Core frontend surfaces: dashboard, a unified `/resources` browse page (works for
  guests and signed-in users, defaults to the signed-in user's own program/semester
  when set), resource detail page, upload form, profile/onboarding, navbar/mobile nav.
- Personal space split out under `/library` (recent, bookmarks, uploads, auth-required),
  separate from the shared/generic `/resources` browsing and sharing surface.
- Light/dark/system theming across the whole web app (`next-themes`), including Clerk's
  own hosted UI (`@clerk/themes`), on top of the existing token-based color system.
- Inline file preview (`/resources/r/[resourceId]/files/[fileId]`) with a collapsible
  details/file-switcher side panel, backed by short-lived Azure SAS URLs (visibility-
  gated to the file's resource — see the moderation bullet below).
- Resource moderation and roles: `USER`/`MODERATOR`/`ADMIN`, a pending-review workflow
  (new uploads stay invisible until a moderator approves them; reject/remove with a
  reason, both with append-only history), reporting on already-approved resources
  (reporter identity hidden from the uploader), and an admin role-management page. See
  `project-overview.md` section 9 for the full picture.
- Centralized API error handling, request validation (`class-validator`), and basic
  IP-based rate limiting.
- Resource upvote/downvote and download-count tracking: one vote per user per resource,
  a real upvote aggregate on public profiles (replacing an old placeholder number), and
  download counts that only increment on an actual download, not an inline preview.
- Marketplace listings (`/market`): post something for sale or wanted with 1-6 required
  photos, browse/search/filter publicly (no sign-in needed), edit/delete/mark-fulfilled/
  reactivate as the owner, report-to-remove moderation, and a "My Listings" page. See 
  `project-overview.md` section 10.
- Real-time messaging (`/messages`) tied to marketplace listings: a WebSocket-backed
  chat (the project's first real-time feature), a live unread-count nav badge, an inbox,
  and per-conversation threads. See `project-overview.md` section 11.
- API rebuilt from Express onto NestJS: consistent Controller -> Service -> Repository
  layering across every module, `class-validator` DTOs, and Clerk auth via
  `@clerk/backend` - same routes, database, and response shapes throughout.
