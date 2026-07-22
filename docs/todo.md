# TODO

Planned work and known rough edges, in no strict order. Check items off as they land;
add new ones as they come up. Keep entries short — link to an issue/PR instead of writing
essays here once something is actively being worked on.

## Backend

- [ ] Replace the flat IP-keyed rate limiter with a hybrid one: higher limits keyed by
      `userId` for authenticated requests, stricter limits keyed by IP for guests. Needed
      because campus/hostel wifi NATs put many students behind one IP.
- [ ] Add a `@socket.io/redis-adapter` if the API is ever horizontally scaled - the
      marketplace-messaging gateway's in-memory adapter only broadcasts within one
      server process today.
- [ ] `startConversation` (REST, the first message of a new conversation via "Message
      Seller"/"Message Poster") never emits `conversation_updated`, unlike `sendMessage`
      (socket, every message after the first) - so the recipient's nav badge doesn't
      update live for a brand-new conversation, only on next refresh. Fix needs
      `MessagingService` and `MessagingGateway` to both react to "a message was created"
      without a direct dependency in either direction (they'd otherwise form a cycle,
      since the gateway already depends on the service) - likely an event-emitter
      (`@nestjs/event-emitter`, not currently used anywhere in this codebase) decoupling
      the two sides instead.

## Frontend

- [ ] Build out the placeholder destinations: Community, Alumni —
      both currently one-line stub pages linked from the nav.
- [ ] Inline preview for .docx files on the file preview page (currently only PDF/JPEG/PNG
      render inline; .docx falls back to "download to view"). Tried `docx-preview` client-side
      - rendering itself worked once the storage account's CORS was configured for JS `fetch()`,
      but the rendered page's fixed real-world width kept overflowing its container and pushing
      the rest of the layout off-screen; reverted for now, revisit the layout/containment
      approach later.

## Housekeeping

- [ ] Add a basic test suite to at least the API (currently no tests on either app; CI
      only lints/typechecks/builds).