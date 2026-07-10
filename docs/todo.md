# TODO

Planned work and known rough edges, in no strict order. Check items off as they land;
add new ones as they come up. Keep entries short — link to an issue/PR instead of writing
essays here once something is actively being worked on.

## Backend

- [ ] Replace the flat IP-keyed rate limiter with a hybrid one: higher limits keyed by
      `userId` for authenticated requests, stricter limits keyed by IP for guests. Needed
      because campus/hostel wifi NATs put many students behind one IP.
- [ ] Add basic moderation/reporting for uploaded resources (currently any signed-in user
      can upload with no review or takedown path).
- [ ] Design and build an upvote/reputation system for resources or uploaders — the public
      profile page currently shows a placeholder "Upvotes" count with no backing data or
      logic at all.

## Frontend

- [ ] Build out the placeholder destinations: Community, Market/Marketplace, Alumni,
      Offerings list page — all currently one-line stub pages linked from the nav.
- [ ] Wire up "Similar Resources" on the resource detail page — no recommendation logic
      exists yet, so it currently shows hardcoded placeholder entries.

## Housekeeping

- [ ] Add a basic test suite to at least the API (currently no tests on either app; CI
      only lints/typechecks/builds).