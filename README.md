# Pitch Lock

Secure investor pitch platform — protected pitch rooms, Pitch Access Agreements, and tier-based investor dashboards.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS 4**
- **Supabase** (database & auth — step 2)
- **Resend** (transactional email — step 2)
- **LiveKit** (PitchMeeting — step 2)
- **Vercel**-ready deployment

## Local dev

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes (step 1 — placeholders)

| Route | Purpose |
|-------|---------|
| `/` | Pitch Lock flash landing |
| `/nda` | Pitch Access Agreement |
| `/dashboard/investor` | Investor dashboard |
| `/dashboard/presenter` | Presenter dashboard |
| `/pitch` | Pitch Room |
| `/book` | Book PitchMeeting |
| `/meet` | Join PitchMeeting |
| `/documents` | Documents Vault |
| `/questions` | Questions |
| `/interest` | Investment Interest |
| `/pricing` | Presenter pricing tiers |

## Environment

Copy `.env.example` to `.env.local` and fill in values when connecting Supabase, Resend, and LiveKit.

### Supabase migrations

1. Run `supabase/migrations/20260531120000_pitch_access_core.sql` in the Supabase SQL editor (new projects).
2. If NDA signing fails with missing-column errors, run **`supabase/migrations/20260602000000_pitch_access_schema_repair.sql`** in the SQL editor (idempotent; adds audit/NDA columns). Wait a minute for the schema cache to refresh, then retry `/nda`.

### Pitch Access Agreement

- Sign at `/nda` → `POST /api/pitch-access/sign`
- Health check: `GET /api/pitch-access/status`

## Deploy

Connect this folder to Vercel. Set environment variables from `.env.example` in the Vercel dashboard.
