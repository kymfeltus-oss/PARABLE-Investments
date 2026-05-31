# Environment variables for Vercel

Use this checklist when adding variables in the Vercel dashboard: **Project → Settings → Environment Variables**.  
Set each key for **Production** (and **Preview** / **Development** if you want parity).

**Do not commit real secrets to Git.** Paste values only in Vercel (or local `.env.local`).

Variables that **Vercel sets automatically** (you normally do **not** add them): `VERCEL`, `VERCEL_URL`, `VERCEL_ENV`, `VERCEL_GIT_COMMIT_SHA`, `NODE_ENV`.

---

## 1. Parable ERP (this repo: `PARABLE-Investments`)

Deploy this project to its own Vercel project. Keys marked **required** are needed for core investor flows (Supabase auth/gate, NDA, meeting registration).

| Name | Vercel env | Required | Notes |
|------|------------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | **Yes** (for investor auth, legal gate, NDA) | e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | **Yes** (same as above) | Supabase **anon public** key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development | **Yes** (server routes: agreements, meetings, webhooks) | **Secret** — server only, never `NEXT_PUBLIC_` |
| `SUPABASE_URL` | All | No | Legacy alias; same URL as `NEXT_PUBLIC_SUPABASE_URL` if the code reads it |
| `NEXT_PUBLIC_SITE_URL` | Production (recommended) | Strongly recommended | Canonical site URL for links in emails, e.g. `https://yourdomain.com` (no trailing slash) |
| `NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL` | Production | Recommended | Shown in UI + used as mail fallback; use a real address on your domain |
| `RESEND_API_KEY` | Production | Recommended for email | From [Resend](https://resend.com); without it, some mail paths no-op |
| `RESEND_FROM_EMAIL` | Production | Recommended | Verified sender, e.g. `Parable <meetings@your-domain.com>` |
| `NDA_STAFF_EMAIL` | Production | No | Staff copy for NDA PDFs; has a code default if unset |
| `NEXT_PUBLIC_SCHEDULING_URL` | Production | No | Cal.com (or similar) booking link |
| `NEXT_PUBLIC_SCHEDULING_EMBED_URL` | Production | No | Optional iframe `src` override |
| `CALCOM_WEBHOOK_SECRET` | Production | No | Secret for `POST /api/webhooks/cal` |
| `MEETING_MASTER_KEY` | Production | No | Staff host key for scheduled `/meet` join path |
| `PARABLE_MASTER_BYPASS_KEY` | Production | No | Optional bypass; keep secret |
| `NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX` | Production | No | Defaults in code if unset |
| `MEETING_CONFIRMATION_CALENDAR_OFFSET_HOURS` | Production | No | `.ics` placeholder tuning |
| `MEETING_CONFIRMATION_CALENDAR_DURATION_MINUTES` | Production | No | `.ics` placeholder tuning |
| `NEXT_PUBLIC_LIVEKIT_URL` | Production | For `/meet` | `wss://…` LiveKit WebSocket URL |
| `LIVEKIT_URL` | Production | Alternative to public URL | Host or URL; server resolves WS |
| `LIVEKIT_WS_URL` | Production | No | Optional alias |
| `LIVEKIT_API_KEY` | Production | For `/meet` tokens | Server only |
| `LIVEKIT_API_SECRET` | Production | For `/meet` tokens | Server only |
| `NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL` | Production | No | HTTPS MP4 for intro |
| `NEXT_PUBLIC_INVESTOR_FLASH_VIDEO_URL` | Production | No | Portal flash video |
| `NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL` | Production | No | `/meet` welcome MP4 |
| `NEXT_PUBLIC_GAMMA_PROPOSAL_URL` | Production | No | Proposal deck embed |
| `NEXT_PUBLIC_GAMMA_PROPOSAL_START_HASH` | Production | No | e.g. `#card-…` |
| `GAMMA_EMBED_URL` | Production | No | Server-only embed URL alias |
| `NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL` | Production | No | MP4 override |
| `NEXT_PUBLIC_PARABLE_PROTOTYPE_URL` | Production | No | `/explore` iframe URL |
| `NEXT_PUBLIC_GIT_SHA` | Production | No | Optional; Vercel can use `VERCEL_GIT_COMMIT_SHA` via `next.config.js` |

**Supabase SQL:** run the schema files from this repo in the **same** Supabase project you point the keys at (see `README.md` and `docs/SUPABASE_SETUP.md`).

---

## 2. Pitch Lock (white-label pitch app)

**Source folder:** `C:\Users\kymfe\Downloads\PitchLock` (canonical repo for Pitch Lock — do not rely on older copies under `Projects\pitch-room-saas`).

Use a **separate Vercel project** and ideally a **separate Supabase project** from Parable, unless you intentionally share one database.

| Name | Vercel env | Required | Notes |
|------|------------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | **Yes** | e.g. `https://fldmhxacgctdnhppjeyi.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | **Yes** | Anon key; also enables Realtime broadcast for guided sync |
| `SUPABASE_SERVICE_ROLE_KEY` | All | **Yes** | **Secret** — all server DB access |
| `SUPABASE_URL` | All | No | Optional alias for server URL |
| `SESSION_JWT_SECRET` | All | **Yes** | Long random string (≥ 16 chars); signs investor + founder session cookies |
| `NEXT_PUBLIC_SITE_URL` | Production | **Yes** in prod | Your deployed origin, e.g. `https://pitchlock.yourdomain.com` |
| `ADMIN_DEV_PASSWORD` | Preview / Development only | For `/admin` in dev | Prefer replacing with real auth in production |
| `NEXT_PUBLIC_PLATFORM_NAME` | All | No | Display name; default branding **Pitch Lock** |
| `NEXT_PUBLIC_DEFAULT_WORKSPACE_SLUG` | All | No | Home “open sample workspace” slug |
| `NEXT_PUBLIC_SHOW_PLATFORM_FOOTER` | All | No | Set to `true` only if you want the powered-by footer |
| `RESEND_API_KEY` | Production | Recommended | NDA / portal emails |
| `RESEND_FROM_EMAIL` | Production | Recommended | Verified sender |
| `NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL` | Production | Recommended | Contact + mail fallback |
| `NEXT_PUBLIC_LEGAL_BRAND_NAME` | Production | No | Subject line / legal display name |
| `OWNER_ALERT_EMAIL` | Production | No | Owner alerts if workspace has no contact |
| `SUPABASE_EDGE_NDA_AUTOMATION` | Production | No | Set to `1` only if you deploy the optional Edge pipeline |

Run **this app’s** Supabase migrations in the Supabase project tied to these keys.

---

## Copy-paste template (empty values)

Fill in and add in Vercel, or merge into a local `.env` for `vercel env pull` workflows.

### Parable ERP

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NDA_STAFF_EMAIL=
NEXT_PUBLIC_SCHEDULING_URL=
NEXT_PUBLIC_SCHEDULING_EMBED_URL=
CALCOM_WEBHOOK_SECRET=
MEETING_MASTER_KEY=
PARABLE_MASTER_BYPASS_KEY=
NEXT_PUBLIC_SCHEDULED_MEET_ROOM_SUFFIX=
MEETING_CONFIRMATION_CALENDAR_OFFSET_HOURS=
MEETING_CONFIRMATION_CALENDAR_DURATION_MINUTES=
NEXT_PUBLIC_LIVEKIT_URL=
LIVEKIT_URL=
LIVEKIT_WS_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_INVESTOR_INTRO_VIDEO_URL=
NEXT_PUBLIC_INVESTOR_FLASH_VIDEO_URL=
NEXT_PUBLIC_LIVE_MEETING_INTRO_VIDEO_URL=
NEXT_PUBLIC_GAMMA_PROPOSAL_URL=
NEXT_PUBLIC_GAMMA_PROPOSAL_START_HASH=
GAMMA_EMBED_URL=
NEXT_PUBLIC_PROPOSAL_PRESENTATION_VIDEO_URL=
NEXT_PUBLIC_PARABLE_PROTOTYPE_URL=
NEXT_PUBLIC_GIT_SHA=
SUPABASE_URL=
```

### Pitch Lock (`C:\Users\kymfe\Downloads\PitchLock`)

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SESSION_JWT_SECRET=
NEXT_PUBLIC_SITE_URL=
ADMIN_DEV_PASSWORD=
NEXT_PUBLIC_PLATFORM_NAME=Pitch Lock
NEXT_PUBLIC_DEFAULT_WORKSPACE_SLUG=
NEXT_PUBLIC_SHOW_PLATFORM_FOOTER=false
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NEXT_PUBLIC_INVESTOR_CONTACT_EMAIL=
NEXT_PUBLIC_LEGAL_BRAND_NAME=
OWNER_ALERT_EMAIL=
SUPABASE_EDGE_NDA_AUTOMATION=0
SUPABASE_URL=
```

---

## Security reminders

- Never prefix **service role** or **LiveKit secrets** or **JWT/session secrets** with `NEXT_PUBLIC_` — they would ship to the browser.
- Rotate keys if they are ever pasted into a ticket, chat, or public repo.
- Use different `SESSION_JWT_SECRET` (and ideally different Supabase projects) for Parable vs Pitch Lock.
