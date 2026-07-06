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

## Frontend

- [ ] Build out the placeholder destinations: Community, Market/Marketplace, Alumni,
      Offerings list page — all currently one-line stub pages linked from the nav.
- [ ] Wire up the navbar `SearchBar` — it's currently a fully dead placeholder button
      (no click handler, no logic) despite being visible in both desktop and mobile nav.
- [ ] Wire up "Similar Resources" on the resource detail page — no recommendation logic
      exists yet, so it currently shows hardcoded placeholder entries.

## Housekeeping

- [ ] Add a basic test suite to at least the API (currently no tests on either app; CI
      only lints/typechecks/builds).
