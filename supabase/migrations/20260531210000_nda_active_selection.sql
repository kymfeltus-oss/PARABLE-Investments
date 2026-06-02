-- Active NDA selection: link finalized templates to pitches and signed records.

alter table public.nda_templates
  add column if not exists is_active boolean not null default false,
  add column if not exists active_for_presenter boolean not null default false,
  add column if not exists active_for_pitch_id uuid references public.pitches (id) on delete set null,
  add column if not exists signing_url text;

create index if not exists nda_templates_active_presenter_idx
  on public.nda_templates (presenter_email, active_for_presenter)
  where active_for_presenter = true;

create index if not exists nda_templates_active_pitch_idx
  on public.nda_templates (active_for_pitch_id)
  where active_for_pitch_id is not null;

alter table public.pitches
  add column if not exists active_nda_template_id uuid references public.nda_templates (id) on delete set null;

create index if not exists pitches_active_nda_template_idx on public.pitches (active_nda_template_id);

alter table public.pitch_access_agreements
  add column if not exists signing_url text,
  add column if not exists pdf_url text,
  add column if not exists signed_record_url text;

comment on column public.nda_templates.signing_url is 'Canonical investor signing URL for this finalized template.';
comment on column public.pitch_access_agreements.signed_record_url is 'Online view URL for immutable signed record.';
