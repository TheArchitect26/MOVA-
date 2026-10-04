# MOVA

A mobile-first React social app prototype with a private demo assistant.

## Start

Requires Node.js 20.19+ (or 22.12+).

```sh
cd /workspace/mova
npm install
npm run dev
```

Open http://localhost:5173. To create a production bundle, run `npm run build`; `npm run preview` serves it at http://localhost:4173.

## Features

Feed and following tabs; varied fictional creators; reactions, comments, saves, follows, remix and sharing into local chats. Composer supports quick posts, images/video, meme and article templates, preview, drafts and local publishing. Profile editing includes an avatar, colour and readable name styles. Chats support messages and reactions. Ask MOVA keeps its conversation separate from the feed, labels demo responses, and previews simulated actions for approval. Reports, blocking, post removal, conversation leaving, visibility labels and reset are included.

## Prototype limitations

Everything is device-local in browser localStorage, including profile, posts, drafts, reactions, follows, messages and assistant history. This is not encrypted storage; use sample information, not sensitive data. Reset via Profile → Settings → Reset demo data. Clearing browser storage also resets the app.

Media is stored as local data URLs, never uploaded to a server; each file is limited to 3 MB and total storage depends on browser quota. Unsplash sample photos and Google Fonts need internet access. The seeded short film is an animated photo demonstration; uploaded video plays with native controls. Sticker reactions animate through CSS. Creators and conversations are fictional; no real online messaging occurs. Visibility settings are local labels, not server access controls, because this prototype has only one user.

Ask MOVA uses deterministic demo responses, not an AI API. Approval records a local simulation; nothing is sent, submitted or booked. Assistant content enters the feed only through “Use in a new post” followed by explicit publishing.

## Next steps

- Add server authentication and authorization; enforce ownership and visibility on every request.
- Replace browser persistence with a database, migrations and backups.
- Upload media to object storage using signed URLs; add transcoding, limits and scanning.
- Add authenticated real-time messaging with delivery states and membership permissions.
- Replace `demoAssistant` in `src/main.jsx` with a call to an authenticated server endpoint. Keep provider credentials on the server. Validate proposed actions, show exact recipient/payload previews and require approval before external execution.
- Connect reporting to moderation, enforce blocks server-side, and add rate limits.

## Validation

See `tests/flows.spec.js` for browser flow checks. Run `npx playwright test` with Chromium installed; Install the test browser with `npx playwright install chromium`. Set `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium` to use a system installation. The suite starts a Vite server automatically.

Current verification: production build passed. Browser tests are included but have not completed successfully in the cloud sandbox; runtime flows remain unverified.
