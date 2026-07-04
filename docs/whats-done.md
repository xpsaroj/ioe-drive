# What's Done

A quick, high-level list of what already works. For the full picture see
`project-overview.md`; for what's next see `todo.md`.

- Monorepo scaffolding: Next.js 16 web app + Express 5 API, Docker Compose dev stack,
  per-app CI (lint, typecheck, build) plus a merge gatekeeper and a deploy workflow.
- Full Postgres schema (Drizzle): programs, subjects, subject offerings, marks, users,
  profiles, resources + files, recently-accessed and bookmarked tracking, webhook
  idempotency.
- Seed data for all IOE engineering programs (plus the SH service department) and their
  new-syllabus subjects/offerings, keyed so seeders can be safely re-run.
- Clerk authentication end to end: protected routes on the web app, `requireAuth` on the
  API, and a webhook that keeps a local `users`/`profiles` mirror in sync with Clerk.
- Resources generalized from the old "notes-only" model: DB tables, API routes
  (`/api/resources`, `/api/me/resources`, etc.), and frontend types/hooks/components all
  renamed to the generic "resource" concept, with a required `type` field (note, past
  question, assessment, lab sheet, book, other) and a data-preserving rename migration.
- Resource CRUD: create/update/list/detail, with multi-file upload straight to Azure Blob
  Storage.
- Per-user "recently accessed" and "bookmarked" resource tracking (the old "archived"
  naming was renamed to "bookmarked" end to end, DB through UI).
- Profile management: program, semester, college, bio, onboarding flow.
- Core frontend surfaces: dashboard, a unified `/resources` browse page (works for
  guests and signed-in users, defaults to the signed-in user's own program/semester
  when set), resource detail page, upload form, profile/onboarding, navbar/mobile nav.
- Personal space split out under `/library` (recent, bookmarks, uploads, auth-required),
  separate from the shared/generic `/resources` browsing and sharing surface.
- Centralized API error handling, request validation (Zod), and basic IP-based rate
  limiting.
