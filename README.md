# Parable Investments

Static investor site (Next.js). **Routes:** `/` landing → optional **`/investor`** (Legal Gate + magic link; **`/investor/page-2`** requires auth) → **`/nda`** (e-sign + `investor_agreements`) → **`/start`** (hub) → **`/explore`** (optional embedded Parable app prototype; set `NEXT_PUBLIC_PARABLE_PROTOTYPE_URL`) → **`/book`** (register name/email + NDA acknowledgment → **email confirmation** with video link → embedded **Cal.com** calendar) → **`/info`** and **`/meet`** (LiveKit).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Deploy

Connect the repo to **Vercel** (or any Next.js host). **Canonical URL:** `https://parableinvestments.com` (see `src/lib/investor-site.ts`).

### App prototype (`/explore`)

Optional. Set **`NEXT_PUBLIC_PARABLE_PROTOTYPE_URL`** to a public **HTTPS** URL (staging or demo) of the Parable product. Investors who have passed the NDA can open **`/explore`** from the choice hub (`/start`) to use an **iframe** or **open in new tab**. If the prototype is on another origin, allow this site in **`Content-Security-Policy: frame-ancestors`** (or equivalent) so the embed can load; otherwise the page still works via “Open in new tab.”

### LiveKit (investor video — `/meet`)

Set in the host’s environment:

- `NEXT_PUBLIC_LIVEKIT_URL` or `LIVEKIT_URL` — WebSocket URL, e.g. `wss://your-project.livekit.cloud` (either works; URL is read on the server and passed into `/meet`)
- `LIVEKIT_API_KEY` — server API key (secret)
- `LIVEKIT_API_SECRET` — server API secret

Room names are restricted to `investor-*` (e.g. `investor-team-call`). The static cover does not require LiveKit.

**Scheduled URL (`/meet?join=scheduled&room=…`):** each **Book a meeting** registration gets a **unique room suffix** (stored in **`meeting_nda_evidence.room_suffix`**; full LiveKit name = `investor-<suffix>`). The `room` query should match the confirmation email. If the URL has no `room` param, the app uses **`NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX`** or the legacy default `scheduled-call`. `POST /api/meeting/verify-join` checks email + `room_suffix` in **`meeting_nda_evidence`**, then issues the token.

### Supabase (Legal Gate + `/nda`)

1. Create a Supabase project (or use an existing one).
2. Run **`supabase/schema-legal-signatures.sql`**, **`supabase/schema-investor-agreements.sql`**, and **`supabase/schema-meeting-nda-evidence.sql`** in the SQL editor. If the meeting table already existed without per-room data, also run **`supabase/schema-meeting-nda-evidence-room-suffix-migration.sql`** once.
3. **Auth → URL configuration:** set **Site URL** to your production origin (e.g. `https://parableinvestments.com`). Under **Redirect URLs**, add `https://your-domain.com/auth/callback` (and `http://localhost:3003/auth/callback` for local dev).
4. In Vercel (and `.env.local`), set:
   - **`NEXT_PUBLIC_SUPABASE_URL`**
   - **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - **`SUPABASE_SERVICE_ROLE_KEY`** (server-only; never expose to the client)

**Legal Gate (`/investor`):** inserts **`legal_signatures`** (`email`, `nda_version`, `ip_address`, `browser_info`, `signed_at`), then sends a **magic link** (`signInWithOtp`). **`/investor/page-2`** is protected by middleware (session required).

**NDA step (`/nda`):** inserts **`investor_agreements`** (printed name, signature, email, document snapshot, etc.). Have counsel review `src/lib/investor-agreement-text.ts` before relying on it.

### Booking (`/book` → `/book/finish`)

1. User enters **name + email** and confirms the scheduling request is under their **NDA** obligations. On success, the app **redirects to `/book/finish`** on the same site: email/room summary and the **scheduling iframe** (session is stored in `sessionStorage` for that step).
2. **`POST /api/meeting/register`** inserts **`meeting_nda_evidence`** (name, email, `nda_version`, **`room_suffix`**, IP/UA) and, when **Resend** is configured, emails a **confirmation** with the **LiveKit join URL** (including `&room=`), room name, and NDA version reference. A team copy can go to **`NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL`**.
3. **`NEXT_PUBLIC_SCHEDULING_URL`** — Cal.com booking link: if the host is `cal.com`, the app adds `?embed=true` and shows the **embedded calendar** for choosing a time (your calendar provider may email the slot separately).
4. **`NEXT_PUBLIC_SCHEDULING_EMBED_URL`** — optional full iframe `src` (e.g. Calendly embed).
5. **`NEXT_PUBLIC_SITE_URL`** — canonical URL for links (Vercel `VERCEL_URL` is a fallback).

### Optional env (see `.env.example`)

- `NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX` — optional default suffix when a `/meet` link has no `&room=` (e.g. marketing links); new bookings always get a **generated** suffix in email and the API response.
- `NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL` — mailto target and internal booking notifications.
