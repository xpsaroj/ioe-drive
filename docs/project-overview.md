# IOE Drive - Project Overview

This document is a snapshot of the project as of 2026-07-03. It exists so that anyone
(including future contributors and AI assistants) can get oriented quickly without having
to re-read the entire codebase. Update it as the project evolves; treat it as living
documentation rather than a historical record.

See `whats-done.md` for a short list of what already works, and `todo.md` for planned
work and known rough edges.

## 1. What this project is

IOE Drive is a collaborative resource-sharing platform for students of the Institute of
Engineering (IOE), Tribhuvan University, Nepal. It lets students browse and download
academic resources (notes, past question papers, assessment papers, books, lab sheets,
etc.) organized by program, semester and subject, and lets signed-in students contribute
resources of their own.

The project is a personal/friends project (not an official IOE product) built and
maintained by me and a small group of collaborators.

### Background: what "IOE" and the "new syllabus" mean

- IOE (Institute of Engineering) is the engineering faculty of Tribhuvan University (TU),
  Nepal's oldest and largest engineering institution, with constituent and affiliated
  colleges (Pulchowk Campus, Thapathali Campus, Purwanchal Campus, and many affiliated
  private colleges) offering Bachelor's level (BE / B.Arch) engineering programs.
- IOE runs Bachelor's programs across disciplines such as Computer (BCT), Civil (BCE),
  Electrical (BEL), Electronics, Communication & Information (BEI), Mechanical (BME),
  Architecture (BAR), Geomatics (BGE), Industrial (BIE), Agriculture (BAG), Automobile
  (BAM), Aerospace (BAS) and Chemical (BCH) Engineering. Most programs run 4 years / 8
  semesters; Architecture (BAR) runs 5 years / 10 semesters.
- First-year and some early-semester "service" subjects (math, physics, chemistry,
  communication, etc.) are owned by the Department of Science and Humanities (SH), which
  is not a student-facing program but exists in this project's data model purely to keep
  subject ownership consistent (`totalYears: 0` is used as a flag for this).
- "New syllabus" refers to IOE's revised curriculum (subject codes such as `ENCE 201`,
  `ENSH 201`, replacing the older short codes from the pre-revision curriculum). This
  project's seed data targets the new syllabus exclusively — subject codes, credit/marks
  breakdowns (theory assessment/final, practical assessment/final) and syllabus links all
  point at the current curriculum published on `ioe.tu.edu.np`. There is no support for
  the old syllabus, and none is currently planned.

## 2. Repository layout

This is an npm-workspaces-free monorepo (two independently managed apps, tied together
with a root `docker-compose.yml` and a handful of root convenience scripts):

```
ioe-drive/
├── apps/
│   ├── server/     Express + Drizzle ORM API (apps/server/src)
│   └── web/         Next.js 16 App Router frontend (apps/web/src)
├── docs/            Project documentation (this file, whats-done.md, todo.md)
├── .github/workflows/  CI (lint/typecheck/build) + deploy
├── docker-compose.yml  Local dev stack: postgres, server, web
├── SETUP.md         Manual (non-Docker) and Docker setup instructions
└── CONTRIBUTING.md   Fork/branch/PR workflow
```

There is no shared package between `apps/server` and `apps/web` — types are duplicated by
hand on each side (see section 8).

## 3. Architecture and tech stack

- **Style**: client-server, REST API consumed by a Next.js frontend.
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, TanStack Query v5 for
  server state, React Hook Form + Zod for forms, Clerk for auth, Lucide icons, `sonner`
  for toasts.
- **Backend**: Node 22, Express 5, layered as Controller -> Service -> Repository
  (repository layer only exists for `resources` today; other modules query Drizzle
  directly from the service layer — see section 7).
- **Database**: PostgreSQL 16, Drizzle ORM + drizzle-kit for schema/migrations.
- **Auth**: Clerk (`@clerk/express` on the API, `@clerk/nextjs` on the web app), with a
  Clerk webhook keeping a local `users`/`profiles` mirror in sync.
- **File storage**: Azure Blob Storage (uploads go through Multer in-memory storage, then
  are streamed to a blob container). A `backblaze-b2` dependency is present in
  `apps/server/package.json` but nothing currently uses it — Azure is the only storage
  backend actually wired up.
- **Deployment** (per README/CI): web to Vercel, API to render (a self-managed VM via SSH + pm2 is also specified but not actually used
  (see `.github/workflows/deploy-server.yml`)).

## 4. Data model (apps/server/src/db/schema.ts)

Enums:
- `semester_enum`: "1".."10"
- `year_enum`: "1".."5"
- `subject_hardness_level_enum`: EASY, MEDIUM, HARD, VERY_HARD
- `resource_type_enum`: NOTE, PAST_QUESTION, ASSESSMENT, LAB_SHEET, BOOK, OTHER

Tables:
- `programs` — id, code (e.g. BCT, BCE, SH), name, totalYears, syllabusUrl.
- `subjects` — id, code, name, programId (FK), hardnessLevel, description, syllabusUrl.
  Subjects belong to exactly one owning program/department (e.g. SH owns first-year
  service subjects) but are *offered* to other programs via `subject_offerings`.
- `subject_marks` — one-to-one with subjects; theoryAssessment/theoryFinal/
  practicalAssessment/practicalFinal integer marks breakdown.
- `subject_offerings` — the join between a subject, the program it's taught in, the year,
  and the semester, plus `isElective`. Unique on (subjectId, semester, programId, year).
  This is the entity most of the app actually filters/browses by (not `subjects` or
  `programs` directly), since the same subject can be offered to multiple programs.
- `users` — id, clerkUserId (unique), fullName, email; mirrors Clerk, created/updated via
  webhook (see section 7).
- `profiles` — one-to-one with users; bio, programId, semester, college,
  profilePictureUrl. When both `programId` and `semester` are set, the `/resources`
  browse page uses them to default its filter for that signed-in user (see section 6).
- `resources` — the generic resource entity (notes, past questions, assessment papers,
  lab sheets, books, etc.): title, description, `type` (resource_type_enum, required),
  offeringId (FK to `subject_offerings`), uploadedBy (FK to users, nullable via
  `set null` on delete).
- `resource_files` — one-to-many with resources; fileUrl, fileSize, originalFileName,
  blobName, mimeType, plus unused-so-far `compressedSize`/`compressionMethod` columns
  (no compression is implemented yet).
- `user_recent_resources` — per-user "recently accessed" tracking, unique on (userId,
  resourceId), used for the dashboard and `/library` "Recently Accessed" lists (capped
  at 5 in the service layer).
- `user_bookmarked_resources` — per-user bookmarks, unique on (userId, resourceId),
  capped at 10 when listed.
- `webhook_events` — svixId primary key + eventType, used purely for Clerk webhook
  idempotency (see section 7).

Eleven migrations exist (`0000`..`0010`). Notable history visible in the migrations:
subjects.code widened to varchar(15) (`0008`); `notes.subject_id` renamed to
`notes.offering_id` with the FK repointed from `subjects` to `subject_offerings` (`0009`)
— i.e. notes were originally tied directly to a subject and were later moved to be tied
to a specific subject *offering* (subject + program + year + semester), which is the
correct granularity for a program/semester-scoped resource library; and `notes`/
`note_files`/`user_recent_notes`/`user_archived_notes` were renamed in place to
`resources`/`resource_files`/`user_recent_resources`/`user_bookmarked_resources`, with a
required `type` column backfilled to `NOTE` for pre-existing rows (`0010`).

## 5. Resource types and the notes -> resources generalization

The product concept was originally "notes" only and has since been generalized to
"resources" (notes, past questions, assessment papers, lab sheets, books, or other), each
tagged with a required `type` field (`resource_type_enum` in the DB, `ResourceType` enum
on both the server and web side). This rename now touches the database, backend, and
frontend consistently:
- DB tables, backend module (`apps/server/src/modules/resources/*`), and frontend entity
  types (`apps/web/src/types/entities/resources.ts`) all use `Resource`/`ResourceFile`/
  `UploadedResource`/`RecentResource`/`BookmarkedResource` naming.
- Components (`ResourceCard`, `ResourceList`, `ResourceFileList`, `UploadedResourceCard`,
  `RecentResourceCard`, `BookmarkedResourceCard`, etc.) consume the `Resource`-shaped
  types/API responses end to end. See section 6 for the current route layout
  (`/resources` vs `/library`).
- The resource-upload form's "Resource Type" selector is wired to the real
  `ResourceType` enum and is actually submitted with the upload (it previously existed
  in the UI but was silently dropped before reaching the API).

A related rename, done in the same pass: "archived" became "bookmarked" throughout —
the DB table is `user_bookmarked_resources` (`bookmarked_at`, not `archived_at`), the API
paths are `/api/me/bookmarked-resources` and `/api/me/resources/:resourceId/bookmark`,
and the frontend type is `BookmarkedResource`.

## 6. Routing: `/resources` (browse/share) vs `/library` (personal space)

Resource browsing and personal resource views used to be mixed together under one
`/resources` hub page (which linked out to `/resources/current`,
`/resources/me/{recent,bookmarks,uploads}`, and `/resources/share`). This has been split
along a clearer line: `/resources` is the shared/generic side (browse the catalog,
contribute to it), `/library` is the signed-in user's personal space (read-only views of
things tied to them).

- `/resources` is now a single unified browse page — there is no more hub page. It always
  shows Program and Semester selects; once both are chosen, a Subject select joins them in
  the same filter row (which wraps responsively on narrow screens), and the page shows the
  subject's details toggle plus its available resources. For signed-in users with
  `program`/`semester` set on their profile, the filter is defaulted automatically via a
  redirect that puts the choice into the URL as query params (e.g.
  `/resources?programId=6&semester=3`), so a specific view is shareable/bookmarkable.
  Guests (and signed-in users with an incomplete profile) get the same picker with no
  default, and browsing works for them too — see the bugfix note below.
- `/resources/share` (upload) and `/resources/r/[resourceId]` (detail) are unchanged in
  behavior, both nested under `/resources` since they're resource-domain actions/views,
  not personal ones.
- `/library` is a new personal-space hub (auth-required): quick links plus preview panels
  for recently-accessed and bookmarked resources, and a link to My Uploads.
  `/library/recent`, `/library/bookmarks`, `/library/uploads` are the corresponding full
  list pages (moved from the old `/resources/me/*`).
- `proxy.ts` explicitly protects `/library(.*)` and `/resources/share(.*)`, while leaving
  `/resources` itself (browsing) and `/resources/r/[resourceId]` public — see section 7.
- **Bugfix along the way**: `useSubjectOfferings` (the hook backing subject/resource
  browsing) was gated with `enabled: isSignedIn`, silently blocking guests from browsing
  at all even though the backing `/api/subjects` endpoint never required auth. That gate
  is removed, so the public-browsing intent actually holds now (this also retires the
  discrepancy that used to be tracked here about `/resources` blocking guests).

## 7. Auth model

Clerk is the identity provider on both sides.

- **Web** (`apps/web/src/proxy.ts`, a Next.js middleware despite the filename): uses
  `clerkMiddleware`/`createRouteMatcher` to protect `/dashboard`, `/library`,
  `/resources/share`, `/community`, `/marketplace`, `/alumni`, `/profile`, `/onboarding`,
  and redirects already-signed-in users away from `/sign-in` and `/sign-up`. `/resources`
  itself (browsing) and `/resources/r/[resourceId]` are intentionally left public — see
  section 6.
- **API** (`apps/server/src/middlewares/auth.middleware.ts`): `requireAuth` reads the
  Clerk session via `getAuth(req)`, then looks up the corresponding row in the local
  `users` table by `clerkUserId`. If no local row exists yet, the request is rejected as
  unauthorized even though Clerk considers the user signed in — the local `users` table
  must be kept in sync with Clerk for auth to work end-to-end (see next point).
- **User sync**: a Clerk webhook (`/api/webhooks/clerk`, verified via svix in
  `webhook.middleware.ts`) handles `user.created`/`user.updated`/`user.deleted` and
  upserts into `users`/`profiles`. `webhook_events` provides idempotency (svixId as PK,
  `onConflictDoNothing`-style dedupe via `alreadyProcessed`/`markProcessed`). There's
  also a standalone seeder script (`db:sync-clerk-users`) that bulk-syncs all users from
  a Clerk *development* instance (it hard-refuses to run against anything but an
  `sk_test_` key) into the local DB, useful for backfilling or resetting a local dev
  database without replaying webhooks.
- Route-level authorization on the API is coarse: whole routers are gated with
  `router.use(requireAuth)` (`me`, `users`) or per-route (`resources` create/update).
  Reading resources/subjects/programs is public; only creating/updating resources and
  anything under `/me` or `/users` requires auth. There is no role/admin concept yet —
  every authenticated user has identical permissions.

## 8. API surface (apps/server)

Mounted in `apps/server/src/server.ts` / `apps/server/src/routes/index.ts`:

- `GET /health` — liveness check, mounted outside `/api` and outside the rate limiter.
- `POST /api/webhooks/clerk` — Clerk webhook receiver, mounted before `express.json()`
  since svix signature verification needs the raw body.
- `/api/me/*` (auth required) — get/update own profile, list own uploaded resources,
  list recently-accessed resources, list bookmarked resources, mark/unmark a resource as
  recently-accessed or bookmarked.
- `/api/users/:userId` (auth required) — fetch another user's public-ish profile.
- `/api/resources` — `GET /` (filter by `offeringId` or `userId`, at least one required),
  `GET /:resourceId`, `POST /` (auth + multipart upload, field name `resourceFile`, up to
  5 files, body includes the required `type`), `PATCH /:resourceId` (auth, must be the
  uploader).
- `/api/programs` — `GET /`, list all programs.
- `/api/subjects` — `GET /?programId=&semester=`, `GET /:subjectId`,
  `GET /upload?programId=&semester=` (subject list scoped for the upload form).

All routes under `/api` share one rate limiter: 500 req / 15 min, keyed by IP (not by
user — see section 10). Responses follow a consistent envelope
(`{ success, data?, message?, error? }`) via `sendSuccessResponse`/`sendErrorResponse` in
`lib/response.ts`, and errors are centralized through `ApiError` subclasses in
`lib/errors.ts` plus a global `errorHandler` that also special-cases `ZodError` and
`MulterError`.

Validation is Zod-based per-route via a generic `validate(schema)` middleware that
validates `{ params, query, body }` together.

## 9. File uploads

`middlewares/upload.ts` configures Multer with in-memory storage, a 10 MB per-file limit,
max 5 files per request, and an allow-list of MIME types: PDF, `.doc`/`.docx`, JPEG, PNG.
Uploaded buffers are pushed straight to Azure Blob Storage
(`utils/azure.ts` -> `lib/azureBlob.ts`) under a randomly generated blob name
(`crypto.randomUUID()` + original extension); the resulting blob URL, size, original
filename and MIME type are persisted per-file in `resource_files`. No image/PDF preview
generation, virus scanning, or compression exists yet (the `compressedSize`/
`compressionMethod` columns are placeholders for future work).

## 10. Known discrepancies / rough edges worth knowing about

- **README deployment target is stale.** `README.md` says the API deploys to Render;
  the actual CI (`.github/workflows/deploy-server.yml`) deploys to a self-managed VM over
  SSH with `pm2`. Worth reconciling once the deployment story is finalized.
- **`backblaze-b2` is an unused dependency** in `apps/server/package.json` — Azure Blob
  Storage is the only storage backend actually implemented.
- **Repository layer is inconsistent.** Only `resources` has a `resources.repository.ts`;
  every other module (`program`, `subject`, `user`, `me`, `webhook`) queries Drizzle
  directly from its service. Not necessarily wrong for their current simplicity, but
  worth a conscious decision before it grows further.
- **Rate limiting is IP-only.** A hybrid limiter (higher, per-`userId` limits for
  authenticated users; stricter per-IP limits for guests) is planned, to avoid punishing
  campus NAT/shared-IP situations (a real concern for IOE hostel/lab wifi). The current
  implementation in `server.ts` is a single flat 500 req/15min limiter keyed by IP for
  everyone. Tracked in `todo.md`.
- **Placeholder nav destinations.** `Community`, `Market` (nav) / `Marketplace` (proxy.ts
  route matcher — inconsistent naming between the two), and `Alumni` all exist as nav
  items and protected routes but their pages (`apps/web/src/app/{community,market,alumni}/page.tsx`)
  are literally one-line placeholders with no functionality.
- **`/offerings` and `/offerings/[offeringId]` are placeholders/thin.** The list page is
  a static "Offerings here" stub; the detail page exists and is linked to from resource
  detail pages but wasn't deeply audited here.
- **No admin/moderation tooling.** Anyone signed in can upload; there's no reporting,
  takedown, or moderation flow for resources yet.
- **No tests.** Neither app has a test suite configured today (CI only lints,
  typechecks, and builds).

## 11. Local development

Two paths, both documented in `SETUP.md`:

- **Without Docker**: `npm install` + `.env` in each of `apps/server` and `apps/web`
  separately, then `npm run db:migrate`, `npm run db:seed-programs`,
  `npm run db:seed-subjects`, `npm run dev` in each app.
- **With Docker** (root `docker-compose.yml`, services `pg`, `server`, `web`): a single
  root `.env` drives everything (see `.env.example`); root `package.json` exposes
  `npm run docker:up|start|stop|down|logs` and proxied `db:*` scripts that run inside the
  `server` container via `docker compose exec`.

Seed data lives in `apps/server/data/{programs,subjects,subject-offerings}.json` — 13
programs (12 engineering programs + SH) and 428 subjects sourced from IOE's published
new-syllabus curriculum pages, keyed by program code so the seeders can be re-run
idempotently (`onConflictDoNothing` throughout).

CI (`.github/workflows/`): separate PR-check workflows for `apps/server` (lint,
typecheck, build) and `apps/web` (lint, build) that only trigger on changes under their
respective path, a `merge-gatekeeper` workflow that requires those checks to pass before
merge, and a deploy workflow for the server on push to `main`.

## 12. Where things stand, in one paragraph

The core "browse and upload resources, scoped by program/semester/subject" loop is fully
built end-to-end, consistently under the "resources" name from the database up through
the UI: seeded curriculum data, a required `type` field distinguishing notes/past
questions/assessments/lab sheets/books/other, Clerk-authenticated upload with
Azure-backed file storage, and a unified `/resources` browse page that works for guests
and defaults from a signed-in user's profile when set. Personal views (recent,
bookmarked, uploaded) now live under their own auth-required `/library` space, separate
from the shared `/resources` browsing/sharing surface. Community, Market/Marketplace and
Alumni are still placeholder destinations with no logic yet; see `todo.md` for what's
next.
