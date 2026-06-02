-- Repair: ensure pitch_access_agreements + nda_templates match the app API.
-- Safe to run on Supabase SQL Editor if `supabase db push` was never applied after the initial core migration.

create extension if not exists pgcrypto;

-- nda_templates (from later migrations)
create table if not exists public.nda_templates (
  id uuid primary key default gen_random_uuid(),
  presenter_id uuid,
  presenter_email text,
  company_name text not null default 'Your Company',
  product_name text not null default 'Pitch Lock',
  presenter_name text,
  governing_state text not null default 'Texas',
  agreement_title text not null default 'Pitch Access Agreement',
  agreement_version text not null default 'nda-v1',
  status text not null default 'draft',
  finalized_at timestamptz,
  public_signing_slug text,
  is_active boolean not null default false,
  active_for_presenter boolean not null default false,
  active_for_pitch_id uuid references public.pitches (id) on delete set null,
  signing_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nda_templates_public_signing_slug_key unique (public_signing_slug)
);

alter table public.nda_templates
  add column if not exists company_name text,
  add column if not exists product_name text,
  add column if not exists presenter_name text,
  add column if not exists agreement_version text,
  add column if not exists is_active boolean not null default false,
  add column if not exists active_for_presenter boolean not null default false,
  add column if not exists active_for_pitch_id uuid references public.pitches (id) on delete set null,
  add column if not exists signing_url text;

alter table public.pitches
  add column if not exists active_nda_template_id uuid references public.nda_templates (id) on delete set null;

alter table public.pitch_access_agreements
  add column if not exists nda_template_id uuid references public.nda_templates (id) on delete set null,
  add column if not exists presenter_name text,
  add column if not exists presenter_email text,
  add column if not exists company_name text,
  add column if not exists product_name text,
  add column if not exists governing_state text,
  add column if not exists document_hash text,
  add column if not exists record_hash text,
  add column if not exists signed_pdf_url text,
  add column if not exists consent_checkbox_text text,
  add column if not exists signed_at_utc timestamptz default now(),
  add column if not exists device_fingerprint text,
  add column if not exists signing_url text,
  add column if not exists pdf_url text,
  add column if not exists signed_record_url text;

create index if not exists pitch_access_agreements_nda_template_idx
  on public.pitch_access_agreements (nda_template_id);

create index if not exists pitch_access_agreements_document_hash_idx
  on public.pitch_access_agreements (document_hash)
  where document_hash is not null;
