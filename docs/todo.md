# TODO

Planned work and known rough edges, in no strict order. Check items off as they land;
add new ones as they come up. Keep entries short — link to an issue/PR instead of writing
essays here once something is actively being worked on.

## Backend

- [ ] Replace the flat IP-keyed rate limiter with a hybrid one: higher limits keyed by
      `userId` for authenticated requests, stricter limits keyed by IP for guests. Needed
      because campus/hostel wifi NATs put many students behind one IP.
- [ ] Decide on a consistent repository-layer convention across modules (today only
      `resources` has a `*.repository.ts`; everything else queries Drizzle directly from
      the service).
- [ ] Remove the unused `backblaze-b2` dependency, or actually use it as a fallback/
      secondary storage backend.
- [ ] Add basic moderation/reporting for uploaded resources (currently any signed-in user
      can upload with no review or takedown path).
- [ ] Add pagination to resource list queries (`resourcesRepository.findMany`,
      `MeService#getUploadedResources`) — currently unbounded, fine while the dataset is
      small but will need a limit/offset (or cursor) eventually.
- [ ] Add pagination to `/library/bookmarks` (`MeService#getBookmarkedResources`) —
      currently hard-capped at 10 by `LIMIT`, so bookmarks beyond the 10 most recent
      are invisible on that page even though they still exist in the DB.

## Frontend

- [ ] Build out the placeholder destinations: Community, Market/Marketplace, Alumni,
      Offerings list page — all currently one-line stub pages linked from the nav.
- [ ] Wire up the navbar `SearchBar` — it's currently a fully dead placeholder button
      (no click handler, no logic) despite being visible in both desktop and mobile nav.

## Housekeeping

- [ ] Add a basic test suite to at least the API (currently no tests on either app; CI
      only lints/typechecks/builds).
