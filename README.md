# Parable Investments

Static investor site (Next.js). **Routes:** `/` landing → **`/nda`** (NDA / non-compete + electronic signature; stored in Supabase when configured) → **`/start`** (join meeting · review materials · request meeting) → **`/info`** (full intro copy) and **`/meet`** (LiveKit).

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

### Signed agreements (`/nda`)

1. Create a Supabase project (or use an existing one).
2. Run `supabase/schema-investor-agreements.sql` in the Supabase SQL editor.
3. In Vercel (and locally), set **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`** (server-only; never expose the service role to the client).

Submissions appear in the **`investor_agreements`** table (printed name, signature text, email, full document snapshot, version, timestamp, optional IP / user agent). Have counsel review the template in `src/lib/investor-agreement-text.ts` before relying on it.

### Optional env (see `.env.example`)

- `NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX` — default room suffix for “scheduled session” links from `/start`.
- `NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL` — mailto target for “Request a meeting”.
- `NEXT_PUBLIC_SCHEDULING_URL` — optional Cal.com / Calendly button on `/start`.
