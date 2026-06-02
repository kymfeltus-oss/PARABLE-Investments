-- Audit trail fields on pitch_access_agreements (single source of truth for signed records).

create extension if not exists pgcrypto;

alter table public.pitch_access_agreements
  add column if not exists document_hash text,
  add column if not exists record_hash text,
  add column if not exists signed_pdf_url text,
  add column if not exists consent_checkbox_text text,
  add column if not exists presenter_name text,
  add column if not exists company_name text,
  add column if not exists product_name text,
  add column if not exists governing_state text,
  add column if not exists signed_at_utc timestamptz default now(),
  add column if not exists device_fingerprint text;

create index if not exists pitch_access_agreements_document_hash_idx
  on public.pitch_access_agreements (document_hash)
  where document_hash is not null;

comment on column public.pitch_access_agreements.document_hash is 'SHA-256 of immutable document_snapshot at signing.';
comment on column public.pitch_access_agreements.record_hash is 'SHA-256 of agreement id + investor email + signed_at_utc + document_hash + signature.';
comment on column public.pitch_access_agreements.signed_at_utc is 'UTC timestamp of electronic execution.';
comment on column public.pitch_access_agreements.device_fingerprint is 'Browser/device string captured at signing (user agent).';

-- Server-side hash helper (optional; primary hashing done in Next.js API).
create or replace function public.sha256_text(input text)
returns text
language sql
immutable
strict
as $$
  select encode(digest(input, 'sha256'), 'hex');
$$;
