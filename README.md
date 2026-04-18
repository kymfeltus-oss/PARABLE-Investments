# Parable Investments

Static investor presentation site (Next.js). **No app backend, auth, or Supabase**—only the cover page at `/`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Deploy

Connect the repo to **Vercel** (or any Next.js host). **Canonical URL:** `https://parableinvestments.com` (see `src/lib/investor-site.ts`).

### LiveKit (investor video — `/meet`)

Set in the host’s environment:

- `NEXT_PUBLIC_LIVEKIT_URL` — WebSocket URL, e.g. `wss://your-project.livekit.cloud`
- `LIVEKIT_API_KEY` — server API key (secret)
- `LIVEKIT_API_SECRET` — server API secret

Room names are restricted to `investor-*` (e.g. `investor-team-call`). The static cover does not require LiveKit.
