# TODO

Planned work and known rough edges, in no strict order. Check items off as they land;
add new ones as they come up. Keep entries short — link to an issue/PR instead of writing
essays here once something is actively being worked on.

## Renames / data model

- [ ] Generalize `notes` into `resources` across DB, API, and frontend types: rename the
      `notes` table to `resources` and `note_files` to `resource_files`, rename the
      backend module and frontend types accordingly, and add a `type` column
      (note, past_question, assessment, lab_sheet, book, etc.) so resource kind is
      explicit instead of implied. The frontend already uses "resource" language in
      routes/components; the data underneath does not yet.
- [ ] Finish the "archived" -> "bookmarked"/"favourite" rename consistently. UI
      copy/routes already say "bookmark", but the DB table (`user_archived_notes`), API
      paths (`/api/me/archived-notes`, `/api/me/notes/:noteId/archive`), and frontend
      types (`ArchivedNote`) still say "archived" everywhere.

## Backend

- [ ] Replace the flat IP-keyed rate limiter with a hybrid one: higher limits keyed by
      `userId` for authenticated requests, stricter limits keyed by IP for guests. Needed
      because campus/hostel wifi NATs put many students behind one IP.
- [ ] Decide on a consistent repository-layer convention across modules (today only
      `notes` has a `*.repository.ts`; everything else queries Drizzle directly from the
      service).
- [ ] Remove the unused `backblaze-b2` dependency, or actually use it as a fallback/
      secondary storage backend.
- [ ] Add basic moderation/reporting for uploaded resources (currently any signed-in user
      can upload with no review or takedown path).

## Frontend

- [ ] Fix `/resources` so it's actually public the way `proxy.ts` intends — the page
      component currently blocks unsigned-in users itself, contradicting the middleware.
- [ ] Build out the placeholder destinations: Community, Market/Marketplace, Alumni,
      Offerings list page — all currently one-line stub pages linked from the nav.

## Housekeeping

- [ ] Add a basic test suite to at least the API (currently no tests on either app; CI
      only lints/typechecks/builds).
