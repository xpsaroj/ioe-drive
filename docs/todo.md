# TODO

Planned work and known rough edges, in no strict order. Check items off as they land;
add new ones as they come up. Keep entries short — link to an issue/PR instead of writing
essays here once something is actively being worked on.

## Backend

- [ ] Replace the flat IP-keyed rate limiter with a hybrid one: higher limits keyed by
      `userId` for authenticated requests, stricter limits keyed by IP for guests. Needed
      because campus/hostel wifi NATs put many students behind one IP.
- [ ] Add a lean, ID-only subject-offerings endpoint (mirroring the existing
      `RESOURCE_PREVIEW_RELATIONS`-style lean-projection pattern). `sitemap.ts` currently
      calls `/subjects?programId=` once per program to enumerate offering IDs, which joins
      subject+program+marks for every row just to read `.id`. Not a real problem at current
      scale (~592 rows, cached daily), but wasteful and worth fixing before it compounds.
- [ ] Add a bulk "list all approved resource IDs" endpoint. `sitemap.ts` only lists subject
      offering pages today, not individual resource pages (`/resources/r/:id`) - no existing
      endpoint returns all approved resources unfiltered (only scoped by offeringId/userId/
      q). Resource pages are still crawlable via normal links from browse/offering pages,
      just not listed directly in the sitemap.
- [ ] Consider moving marketplace listings from report-to-remove to a pre-review
      (`PENDING`/`REJECTED`) model like resources have, if reports turn out to be too
      reactive in practice. Would need a real history table (the current denormalized
      moderation columns only work because REMOVE is a listing's one-and-only possible
      moderation event) and a bit more branching in the status lifecycle, since
      FULFILLED/ACTIVE already exists as its own axis alongside PENDING/REJECTED. Not
      urgent - the live-immediately model was a deliberate choice, not a gap.
- [ ] Add real pagination ("load older messages") to a conversation thread - it currently
      fetches only the most recent 100 messages in one request. Fine for a short
      peer-to-peer negotiation chat, not for a very long-running conversation.
- [ ] Add a `@socket.io/redis-adapter` if the API is ever horizontally scaled - the
      marketplace-messaging gateway's in-memory adapter only broadcasts within one
      server process today.

## Frontend

- [ ] Build out the placeholder destinations: Community, Alumni, Offerings list page —
      all currently one-line stub pages linked from the nav.
- [ ] Inline preview for .docx files on the file preview page (currently only PDF/JPEG/PNG
      render inline; .docx falls back to "download to view"). Tried `docx-preview` client-side
      - rendering itself worked once the storage account's CORS was configured for JS `fetch()`,
      but the rendered page's fixed real-world width kept overflowing its container and pushing
      the rest of the layout off-screen; reverted for now, revisit the layout/containment
      approach later.

## Housekeeping

- [ ] Add a basic test suite to at least the API (currently no tests on either app; CI
      only lints/typechecks/builds).