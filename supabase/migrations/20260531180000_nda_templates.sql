-- NDA template system for Pitch Lock presenter customization.

create table if not exists public.nda_templates (
  id uuid primary key default gen_random_uuid(),
  presenter_id uuid,
  presenter_email text,
  template_name text not null,
  governing_state text not null default 'Texas',
  agreement_title text not null default 'Pitch Access Agreement',
  agreement_body text not null,
  version text not null,
  status text not null default 'draft',
  is_default boolean not null default false,
  finalized_at timestamptz,
  qr_code_url text,
  public_signing_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint nda_templates_public_signing_slug_key unique (public_signing_slug)
);

create index if not exists nda_templates_presenter_email_idx on public.nda_templates (presenter_email);
create index if not exists nda_templates_status_idx on public.nda_templates (status);
create index if not exists nda_templates_public_signing_slug_idx on public.nda_templates (public_signing_slug);

comment on table public.nda_templates is 'Presenter-customizable Pitch Access Agreement templates; finalized versions are version-controlled legal records.';

alter table public.nda_templates enable row level security;

alter table public.pitch_access_agreements
  add column if not exists nda_template_id uuid references public.nda_templates (id) on delete set null;

create index if not exists pitch_access_agreements_nda_template_idx
  on public.pitch_access_agreements (nda_template_id);
