# Supabase setup for PARABLE (from scratch)

Do this once. Then put the URL and anon key in your `.env.local`.

---

## 1. Create a Supabase project

1. Go to **[supabase.com](https://supabase.com)** and sign in (or create an account).
2. Click **New project**.
3. Pick an **organization** (or create one).
4. Set:
   - **Name:** e.g. `parable` or `parable-study`
   - **Database password:** choose a strong password and **save it** (you need it for DB access later).
   - **Region:** pick one close to you.
5. Click **Create new project** and wait until it’s ready (1–2 minutes).

---

## 2. Get your API keys

1. In the left sidebar, open **Project Settings** (gear icon).
2. Click **API** in the left menu.
3. You’ll see:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon public**
4. Copy:
   - **Project URL** → put in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → put in `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. Create the “avatars” storage bucket (for profile photos)

1. In the left sidebar, click **Storage**.
2. Click **New bucket**.
3. **Name:** `avatars`
4. Leave **Public bucket** **on** (so profile images can be shown).
5. Click **Create bucket**.

(If you skip this, sign-up with a profile photo may fail; the rest of the app can still work.)

---

## 4. Run the database script (profiles + study groups)

1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open the file **`supabase/schema-profiles-and-groups.sql`** from your PARABLE project (in Cursor or Notepad).
4. Copy **all** of its contents and paste into the Supabase SQL Editor.
5. Click **Run** (or press Ctrl+Enter).
6. You should see “Success. No rows returned.” (or similar). That means the `profiles` table and the study groups tables are created.

---

## 5. Auth (sign up / sign in)

- **Email** auth is on by default. Users can sign up with email + password.
- To allow sign-up without confirming email (useful for local dev):
  1. Go to **Authentication** → **Providers** → **Email**.
  2. Turn **off** “Confirm email” if you want instant sign-in during development.

---

## 6. Put keys in your app

In your project folder, edit **`.env.local`** and set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

Restart the dev server (`npm run dev`) after changing env vars.

---

## 7. Investor NDA / agreement storage (`/nda`, `POST /api/investor/agreement`)

If you see **“Agreement storage is not configured”** when submitting the NDA, complete this once.

### 7a. Service role key (server only)

1. In Supabase: **Project Settings** → **API**.
2. Under **Project API keys**, copy the **`service_role`** key (secret).  
   **Never** put this in `NEXT_PUBLIC_*` or client code.
3. Add to **`.env.local`** (and to **Vercel** → Project → Settings → Environment Variables for production):

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

`NEXT_PUBLIC_SUPABASE_URL` (or `SUPABASE_URL`) must also be set — same **Project URL** as in step 2.

### 7b. Create the `investor_agreements` table

1. **SQL Editor** → **New query**.
2. Open **`supabase/schema-investor-agreements.sql`** in your repo, copy **all** of it, paste, **Run**.
3. Confirm success (no SQL errors).

### 7c. Redeploy / restart

- **Local:** restart `npm run dev` after changing `.env.local`.
- **Vercel:** redeploy after adding env vars, or use **Redeploy** on the latest deployment.

---

## Done

- **Sign up** in the app (Create Account) and **sign in** (Login).
- **Sanctuary Reader** and **AI Scholar** work with only `OPENAI_API_KEY` in `.env.local`; they don’t need Supabase.
- **The Table** (groups) needs Supabase and the script in step 4.
- **Investor NDA submit** needs step 7 (URL + `SUPABASE_SERVICE_ROLE_KEY` + `schema-investor-agreements.sql`).

If something fails, check the Supabase **Logs** (e.g. Auth logs, Postgres logs) for errors.
