# What's Done

A quick, high-level list of what already works. For the full picture see
`project-overview.md`; for what's next see `todo.md`.

- Monorepo scaffolding: Next.js 16 web app + Express 5 API, Docker Compose dev stack,
  per-app CI (lint, typecheck, build) plus a merge gatekeeper and a deploy workflow.
- Full Postgres schema (Drizzle): programs, subjects, subject offerings, marks, users,
  profiles, notes + files, recently-accessed and archived/bookmarked tracking, webhook
  idempotency.
- Seed data for all IOE engineering programs (plus the SH service department) and their
  new-syllabus subjects/offerings, keyed so seeders can be safely re-run.
- Clerk authentication end to end: protected routes on the web app, `requireAuth` on the
  API, and a webhook that keeps a local `users`/`profiles` mirror in sync with Clerk.
- Notes (resources) CRUD: create/update/list/detail, with multi-file upload straight to
  Azure Blob Storage.
- Per-user "recently accessed" and "archived/bookmarked" note tracking.
- Profile management: program, semester, college, bio, onboarding flow.
- Core frontend surfaces: dashboard, resources hub, current-semester resource browsing,
  resource detail page, upload form, profile/onboarding, navbar/mobile nav.
- Centralized API error handling, request validation (Zod), and basic IP-based rate
  limiting.
