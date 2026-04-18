-- Legal Gate (/investor): run in Supabase SQL Editor.
-- Requires NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY in Vercel.
-- Add Site URL + Redirect URLs in Supabase Auth (e.g. https://your-domain.com/auth/callback).

create table if not exists public.legal_signatures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  nda_version text not null,
  ip_address text,
  browser_info text,
  signed_at timestamptz not null default now()
);

create index if not exists legal_signatures_signed_at_idx on public.legal_signatures (signed_at desc);
create index if not exists legal_signatures_email_idx on public.legal_signatures (email);

comment on table public.legal_signatures is 'Legal Gate acknowledgments before magic link; not legal advice.';

alter table public.legal_signatures enable row level security;
-- No policies: public cannot read/write; API uses service role to insert.
