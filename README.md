# MOVA

A mobile-first React social app with an ink-dark feed, local demo mode, and a working Node.js/SQLite backend.

## Run the complete app

Use **Node.js 22.13+** (Node 24 recommended).

```sh
git clone https://github.com/TheArchitect26/MOVA-.git
cd MOVA-
npm ci
npm run build
npm start
```

Open **http://localhost:3001** on the machine running the server. A cloud workspace needs its own forwarded URL; `localhost` in your browser points to your computer.

The server serves both the frontend and API. Sign in → Create an account enables backend persistence. Unsigned visitors retain a separate local demo. Account registration starts fresh and does not upload your local demo history.

For development, run `npm run server` and `npm run dev` in separate terminals, then open http://localhost:5173. Vite forwards `/api` requests to the backend.

## What works

- Feed and Following tabs; varied fictional creators; reactions, comments, saves, follows, remix, post details and sharing.
- Composer with quick posts, local photo/video previews, meme and article templates, preview, drafts, visibility and publishing.
- Editable name, handle, bio, avatar, colour, gradient, badge and frame styles; posts and saved posts.
- Local demo chats plus real one-to-one account conversations. Start a chat using another registered account’s handle. Messages poll every five seconds; reactions, post sharing and leaving are supported.
- Private assistant conversation, useful demo starters, optional server-side OpenAI responses, explicit post creation, and preview/approval of simulated external actions.
- Reports, blocking, removal, reset controls and account save status.

## Backend

No additional service is required for local use. SQLite creates `data/mova.sqlite` on first start. Passwords use salted scrypt hashes; session tokens are random, hashed in storage, and sent in HttpOnly SameSite cookies. Private account state and assistant history require authentication. Server-side feed access enforces Public, Followers and Only me visibility, along with blocks. Conversation membership is checked on every message/reaction/leave operation. JSON mutations reject unapproved origins, credentials never enter the browser, and account saves use revision checks to prevent silent overwrites across tabs.

The first backend keeps profile, posts, drafts and preferences in versioned per-account JSON records; conversations, memberships, messages, comments, assistant history and approvals use dedicated SQLite tables. Media data URLs are stored in the account record. This is suitable for a small prototype, not a scaled social network.

`src/api.js` is the frontend API adapter. `server/app.mjs` owns persistence, authorization and provider logic; `server/index.mjs` owns HTTP/static serving. The pure request handler is testable without opening a network port.

## Optional AI and configuration

Copy `.env.example` to `.env`. `npm start` and `npm run server` read it automatically.

- `OPENAI_API_KEY`: optional, server-only. Without it, the assistant returns labelled demo responses.
- `OPENAI_MODEL`: defaults to `gpt-4.1-mini`.
- `DATABASE_PATH`: defaults to `data/mova.sqlite`.
- `PORT` / `HOST`: default `3001` / `127.0.0.1`.
- `APP_ORIGIN`: exact browser-facing origin, including scheme and port.
- `NODE_ENV=production`: enables Secure cookies. Serve production over HTTPS and set `APP_ORIGIN` to the HTTPS URL.

MOVA has **no connected email, calendar or booking integrations**. Approval records a simulation only. Nothing is sent, submitted or booked. General AI responses use the configured provider; action requests retain a safe demo preview. Assistant output reaches the feed only after “Use in a new post” and explicit Publish.

## Checks

```sh
npm run test:server
npm run build
npx playwright install chromium
npm run test:browser
```

Eight backend tests cover authentication, durable storage after restart, account isolation, visibility, blocks, comments, conversation membership, reactions, private assistant history, approvals, provider behavior, input validation and origin checks. Browser tests cover mobile/desktop flows, templates, drafts, local image previews, comments, profile editing, reactions/follows, sharing, moderation, keyboard dialogs, reset, account persistence and real messages. Tests start isolated in-memory backend and Vite servers. Optional `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium` uses an existing Chromium installation.

The GitHub Actions workflow builds and runs both suites, retaining browser screenshots/results.

## Current limits

- Local media is limited to 3 MB per file; account saves are capped at 20 MB. Media is stored in SQLite as data URLs, not in object storage. Local demo data uses browser localStorage and depends on browser quota.
- Sample creators/conversations are fictional. The seeded scenic clip is labelled an animated-photo demo; upload a video for actual footage. Stickers use CSS animation. Unsplash photos and Google Fonts need internet access.
- Server enforcement applies to account posts. Unsigned demo visibility is a label only. Sample posts stay editable only within each account’s/demo’s sample experience.
- Chats use polling, not realtime sockets. Real chats currently support two registered accounts; the seeded group is a demo.
- Reports are stored, but no moderation team or queue is connected. Reset in an account preserves its profile, real conversations and private assistant history.
- Sync stops visibly on save/validation/conflict failures. Reload to recover the last server snapshot; failed unsaved edits remain only in memory. Do not close the page while the save status is unresolved.
- No password reset, email verification, OAuth, backups, account deletion UI, or production moderation pipeline yet. Data is not encrypted at rest. Use test information while evaluating.

## Production next steps

Deploy behind HTTPS with a persistent disk and backups; add verified identity/password recovery; normalize posts/interactions and paginate feeds; move media to object storage with signed uploads and scanning; replace polling with a realtime service; add moderation operations and account deletion; integrate approved external actions only after recipient/payload previews and server-side authorization. Review privacy, abuse controls and operational limits before opening registration publicly.
