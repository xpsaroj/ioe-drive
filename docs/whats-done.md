# What's Done

A quick, high-level list of what already works. For the full picture see
`project-overview.md`; for what's next see `todo.md`.

- Monorepo scaffolding: Next.js 16 web app + Express 5 API, Docker Compose dev stack,
  per-app CI (lint, typecheck, build) plus a merge gatekeeper and a deploy workflow.
- Full Postgres schema (Drizzle): programs, subjects, subject offerings, marks, users,
  profiles, resources + files, recently-accessed and bookmarked tracking, webhook
  idempotency.
- Seed data for all IOE engineering programs (plus the SH service department) and their
  new-syllabus subjects/offerings, keyed so seeders can be safely re-run. A separate
  `db:seed-resources` script seeds sample resources (with fake, non-Azure files) for one
  subject per semester per program, for local development/testing.
- Clerk authentication end to end: protected routes on the web app, `requireAuth` on the
  API, and a webhook that keeps a local `users`/`profiles` mirror in sync with Clerk.
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
  detail page or a file within it now actually marks it as recently accessed (top 10
  shown, ordered by last access). A bookmark toggle button now appears on every resource
  card and the detail page (any signed-in user, not just the uploader), backed by a
  bulk "bookmarked resource IDs" endpoint and optimistic UI updates.
- Profile management: program, semester, college, bio, onboarding flow.
- Core frontend surfaces: dashboard, a unified `/resources` browse page (works for
  guests and signed-in users, defaults to the signed-in user's own program/semester
  when set), resource detail page, upload form, profile/onboarding, navbar/mobile nav.
- Personal space split out under `/library` (recent, bookmarks, uploads, auth-required),
  separate from the shared/generic `/resources` browsing and sharing surface.
- Light/dark/system theming across the whole web app (`next-themes`), including Clerk's
  own hosted UI (`@clerk/themes`), on top of the existing token-based color system.
- Inline file preview (`/resources/r/[resourceId]/files/[fileId]`) with a collapsible
  details/file-switcher side panel, backed by short-lived Azure SAS URLs (auth-required,
  not owner-gated).
- Centralized API error handling, request validation (Zod), and basic IP-based rate
  limiting.
