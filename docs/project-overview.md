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
hand on each side (see section 9).

## 3. Architecture and tech stack

- **Style**: client-server, REST API consumed by a Next.js frontend.
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, TanStack Query v5 for
  server state, React Hook Form + Zod for forms, Clerk for auth, Lucide icons, `sonner`
  for toasts, `next-themes` + `@clerk/themes` for light/dark theming (see section 7).
- **Backend**: Node 22, Express 5, layered as Controller -> Service -> Repository
  (repository layer only exists for `resources` today; other modules query Drizzle
  directly from the service layer — see section 12).
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
  webhook (see section 8).
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
  idempotency (see section 8).

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
  `/resources` itself (browsing) and `/resources/r/[resourceId]` public — see section 8.
- **Bugfix along the way**: `useSubjectOfferings` (the hook backing subject/resource
  browsing) was gated with `enabled: isSignedIn`, silently blocking guests from browsing
  at all even though the backing `/api/subjects` endpoint never required auth. That gate
  is removed, so the public-browsing intent actually holds now (this also retires the
  discrepancy that used to be tracked here about `/resources` blocking guests).

## 7. Theming: light/dark mode

The web app supports light, dark, and system (OS-preference-following) themes.

- **Token-based color system**: `apps/web/src/app/globals.css` defines every color as a
  `--color-*` CSS variable inside a Tailwind v4 `@theme` block, and components are built
  on semantic Tailwind classes (`bg-background`, `text-foreground-secondary`,
  `border-border`, etc.) rather than literal colors (`bg-white`, `text-gray-500`). A
  `.dark { ... }` block overrides every one of those tokens with dark-mode equivalents.
- **Tailwind v4's `dark:` variant** defaults to the `prefers-color-scheme` media query;
  this project overrides that with `@custom-variant dark (&:where(.dark, .dark *));` so
  `dark:` instead responds to a `.dark` class, which is what actually gets toggled (see
  next point). A few genuinely-literal color usages that aren't meant to react to the
  theme automatically (severity-tinted badges like `SubjectHardnessBadge`/
  `MimeTypeBadge`, and the black backdrop dimmers behind `Modal`/`MobileNav`) use
  explicit `dark:` classes or are left as literal black on purpose.
- **`next-themes`** (`apps/web/src/providers/theme-provider.tsx`) manages the `.dark`
  class on `<html>` based on system preference or an explicit user choice, persisted to
  localStorage. Root layout (`app/layout.tsx`) sets `suppressHydrationWarning` on
  `<html>`, since next-themes updates that element before React hydrates.
  `apps/web/src/components/ui/ThemeToggle.tsx` is the light/dark toggle button, present
  in the desktop `Navbar`, `MobileNav`, and the signed-out marketing `Header`.
- **`@clerk/themes`** (`apps/web/src/providers/clerk-theme-provider.tsx`) wraps
  `ClerkProvider` and passes Clerk's own `dark` base theme when the site is in dark
  mode, so Clerk's hosted UI (sign-in, sign-up, user profile, user button) matches
  rather than always rendering light.
- **`apps/web/src/hooks/use-mounted.ts`**: a shared hook (via `useSyncExternalStore`,
  not a `useEffect` + `setState` pair - this project's lint config flags that pattern)
  used anywhere theme-dependent output needs to avoid a hydration mismatch (the actual
  resolved theme isn't known until the client has mounted). `Logo`, `ThemeToggle`, and
  `ClerkThemeProvider` all use it to render a neutral/default appearance for the very
  first render, then the real theme-aware output right after.
- `Logo`'s `theme` prop is now optional and auto-picks the correct light/dark logo
  variant to match the site's current theme; pass it explicitly only when a specific
  variant is needed regardless of theme.

## 8. Auth model

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

## 9. API surface (apps/server)

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
  uploader), `DELETE /:resourceId` (auth, must be the uploader; also deletes the
  resource's files from Azure Blob Storage), `POST /:resourceId/files` (auth, must be
  the uploader; attach more files, same multipart shape as creation),
  `DELETE /:resourceId/files/:fileId` (auth, must be the uploader). See section 11 for
  ownership enforcement details and the frontend built on these.
- `/api/programs` — `GET /`, list all programs.
- `/api/subjects` — `GET /?programId=&semester=`, `GET /:subjectId`,
  `GET /upload?programId=&semester=` (subject list scoped for the upload form).

All routes under `/api` share one rate limiter: 500 req / 15 min, keyed by IP (not by
user — see section 12). Responses follow a consistent envelope
(`{ success, data?, message?, error? }`) via `sendSuccessResponse`/`sendErrorResponse` in
`lib/response.ts`, and errors are centralized through `ApiError` subclasses in
`lib/errors.ts` plus a global `errorHandler` that also special-cases `ZodError` and
`MulterError`.

Validation is Zod-based per-route via a generic `validate(schema)` middleware that
validates `{ params, query, body }` together.

## 10. File uploads

`middlewares/upload.ts` configures Multer with in-memory storage, a 10 MB per-file limit,
max 5 files per request, and an allow-list of MIME types: PDF, `.doc`/`.docx`, JPEG, PNG.
Uploaded buffers are pushed straight to Azure Blob Storage
(`utils/azure.ts` -> `lib/azureBlob.ts`) under a randomly generated blob name
(`crypto.randomUUID()` + original extension); the resulting blob URL, size, original
filename and MIME type are persisted per-file in `resource_files`. No image/PDF preview
generation, virus scanning, or compression exists yet (the `compressedSize`/
`compressionMethod` columns are placeholders for future work).

## 11. Resource editing, deletion, and file management

Beyond create/read, resources can now be edited, deleted, and have their files managed
after the fact:

- `DELETE /api/resources/:resourceId` deletes the resource, removes its files from Azure
  Blob Storage, and (via the FK's cascade) their `resource_files` rows.
- `POST /api/resources/:resourceId/files` attaches one or more newly uploaded files to an
  existing resource (same Multer/Azure path as creation, up to 5 files per request —
  there's no cap on how many times this can be called, so a resource's total file count
  isn't hard-limited the way creation's 5-file cap might suggest).
- `DELETE /api/resources/:resourceId/files/:fileId` removes a single file (Azure blob +
  row), scoped to the given `resourceId` so a file id can't be used to reach into a
  different resource than the one the caller is authorized for.
- All of the above, plus `PATCH`, share a `ResourcesService#assertOwnership` check: if the
  resource doesn't exist or isn't owned by the requesting user, a 404 is returned either
  way (not 403), so a non-owner can't distinguish "doesn't exist" from "isn't yours."

Frontend:
- Editing moved from an in-page modal to a dedicated page,
  `/resources/r/[resourceId]/edit` (auth-required via `proxy.ts`, and further gated
  in-page to the resource's actual uploader — a signed-in non-owner sees a plain "you
  can't edit this" message instead of the form). The edit form
  (`components/forms/ResourceEditForm.tsx`) reuses the same Program -> Semester ->
  Subject cascading selects as the upload form, prefilled via `useSubjectDetails` (a
  resource's own summary only carries its offering id, not the offering's
  program/semester needed to seed those selects).
- Below the form, `ResourceFilesManager` lists current files with a per-file delete
  button plus an "Add Files" control — both act immediately as their own mutations,
  independent of the "Save Changes" button.
- `EditResourceButton`/`DeleteResourceButton` appear next to a resource's title on its
  detail page, and on each card in `/library/uploads`, only when the viewer is the
  resource's uploader (`UploadedResourceCard`'s `showOwnerActions` prop, only ever
  passed `true` from the uploads list — the same card is reused on other users' public
  profiles, where it must stay hidden).

Bugs found and fixed while building this:
- `useUpdateResource`'s success handler used to write the `PATCH` response directly into
  the resource-detail query cache via `setQueryData`. That response is just the bare
  updated row (no joined `files`/`subjectOffering`/`uploader`, unlike `GET`), so anything
  reading those fields off the cache — including the still-mounted edit page immediately
  after a save — would crash. Fixed by invalidating that cache key instead of
  overwriting it, so a complete shape is refetched via `GET` rather than a partial one
  ever being exposed.
- `Modal`'s `animate-in`/`fade-in`/`zoom-in-95` classes were dead (no such Tailwind
  plugin/utility exists in this project) — it never actually animated despite looking
  styled for it. Real `--animate-fade-in`/`--animate-scale-in` keyframes were registered
  via Tailwind v4's native `@theme` animation syntax; `Modal` also now closes on Escape
  (respecting `preventCloseOnOutsideClick`).
- `Button`'s `href` mode (renders as a `Link`) silently dropped every prop except
  `className`/`target` (e.g. `aria-label`, `onClick`) — fixed by forwarding the rest of
  the props through, after confirming no existing usage relied on that gap.
- `sonner`'s `<Toaster>` defaults its `theme` prop to `"light"` when not set, which is
  why toasts stayed white in dark mode; `LayoutWrapper` now passes
  `theme={resolvedTheme ?? "system"}` from `next-themes`.

## 12. Known discrepancies / rough edges worth knowing about

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

## 13. Local development

Two paths, both documented in `SETUP.md`:

- **Without Docker**: `npm install` + `.env` in each of `apps/server` and `apps/web`
  separately, then `npm run db:migrate`, `npm run db:seed-programs`,
  `npm run db:seed-subjects`, `npm run dev` in each app.
- **With Docker** (root `docker-compose.yml`, services `pg`, `server`, `web`): a single
  root `.env` drives everything (see `.env.example`); root `package.json` exposes
  `npm run docker:up|start|stop|down|logs` and proxied `db:*` scripts that run inside the
  `server` container via `docker compose exec`. Both app Dockerfiles run as the image's
  built-in non-root `node` user (uid/gid 1000) rather than root, since `apps/server` and
  `apps/web` are bind-mounted into their containers for live editing — running as root
  used to leave files like `.next` root-owned on the host, breaking host-side commands.

Seed data lives in `apps/server/data/{programs,subjects,subject-offerings}.json` — 13
programs (12 engineering programs + SH) and 428 subjects sourced from IOE's published
new-syllabus curriculum pages, keyed by program code so the seeders can be re-run
idempotently (`onConflictDoNothing` throughout). `db:sync-clerk-users` backfills local
`users`/`profiles` rows from a Clerk *development* instance. `db:seed-resources` seeds a
handful of sample resources for local development/testing: for every program except SH,
one subject per semester gets 5 resources, each with 5 fake files - no real uploads, no
Azure calls, just placeholder blob names/URLs/sizes. Unlike the other seeders it is not
idempotent (it doesn't check for previously seeded resources), so it assumes a clean
`resources` table.

CI (`.github/workflows/`): separate PR-check workflows for `apps/server` (lint,
typecheck, build) and `apps/web` (lint, build) that only trigger on changes under their
respective path, a `merge-gatekeeper` workflow that requires those checks to pass before
merge, and a deploy workflow for the server on push to `main`.

## 14. Where things stand, in one paragraph

The core "browse, upload, edit, and delete resources, scoped by program/semester/subject"
loop is fully built end-to-end, consistently under the "resources" name from the
database up through the UI: seeded curriculum data, a required `type` field
distinguishing notes/past questions/assessments/lab sheets/books/other,
Clerk-authenticated upload with Azure-backed file storage, and a unified `/resources`
browse page that works for guests and defaults from a signed-in user's profile when set.
Resource owners can edit a resource's details/subject, delete it entirely, or add/remove
individual files after the fact, all gated by ownership checks enforced server-side.
Personal views (recent, bookmarked, uploaded) now live under their own auth-required
`/library` space, separate from the shared `/resources` browsing/sharing surface. The
whole site supports light/dark/system theming, including Clerk's own hosted UI.
Community, Market/Marketplace and Alumni are still placeholder destinations with no
logic yet; see `todo.md` for what's next.
