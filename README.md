# Parable Investments

Static investor site (Next.js). **Routes:** `/` landing → optional **`/investor`** (Legal Gate: agreement + email + magic link; **`/investor/page-2`** requires auth) → **`/nda`** (full e-sign + `investor_agreements`) → **`/start`** (hub) → **`/info`** and **`/meet`** (LiveKit).

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

### Supabase (Legal Gate + `/nda`)

1. Create a Supabase project (or use an existing one).
2. Run **`supabase/schema-legal-signatures.sql`** and **`supabase/schema-investor-agreements.sql`** in the SQL editor.
3. **Auth → URL configuration:** set **Site URL** to your production origin (e.g. `https://parableinvestments.com`). Under **Redirect URLs**, add `https://your-domain.com/auth/callback` (and `http://localhost:3003/auth/callback` for local dev).
4. In Vercel (and `.env.local`), set:
   - **`NEXT_PUBLIC_SUPABASE_URL`**
   - **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - **`SUPABASE_SERVICE_ROLE_KEY`** (server-only; never expose to the client)

**Legal Gate (`/investor`):** inserts **`legal_signatures`** (`email`, `nda_version`, `ip_address`, `browser_info`, `signed_at`), then sends a **magic link** (`signInWithOtp`). **`/investor/page-2`** is protected by middleware (session required).

**NDA step (`/nda`):** inserts **`investor_agreements`** (printed name, signature, email, document snapshot, etc.). Have counsel review `src/lib/investor-agreement-text.ts` before relying on it.

### Optional env (see `.env.example`)

- `NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX` — default room suffix for “scheduled session” links from `/start`.
- `NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL` — mailto target for “Request a meeting”.
- `NEXT_PUBLIC_SCHEDULING_URL` — optional Cal.com / Calendly button on `/start`.
