-- Run in Supabase SQL Editor (once). Stores electronic NDA / non-compete acknowledgments from /nda.
-- Server inserts via SUPABASE_SERVICE_ROLE_KEY only (see src/app/api/investor/agreement/route.ts).

create table if not exists public.investor_agreements (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  agreement_version text not null,
  document_snapshot text not null,
  printed_name text not null,
  signature text not null,
  email text not null,
  client_ip text,
  user_agent text
);

create index if not exists investor_agreements_created_at_idx on public.investor_agreements (created_at desc);
create index if not exists investor_agreements_email_idx on public.investor_agreements (email);

comment on table public.investor_agreements is 'Electronic signatures from investor NDA / non-compete step; not legal advice—retain counsel.';

alter table public.investor_agreements enable row level security;
-- No policies: anon/authenticated clients cannot read/write; service role bypasses RLS for API inserts.
