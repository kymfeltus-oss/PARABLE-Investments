-- Pitch Builder Studio — publish gate for investor-facing experience

alter table public.investor_experience_profiles
  add column if not exists is_published boolean not null default false,
  add column if not exists published_at timestamptz,
  add column if not exists active_nda_version text,
  add column if not exists pitch_room_slug text not null default 'demo';

comment on column public.investor_experience_profiles.is_published is
  'When true, profile fields are served to investors (single source of truth).';
comment on column public.investor_experience_profiles.active_nda_version is
  'NDA version snapshot at last publish.';
comment on column public.investor_experience_profiles.pitch_room_slug is
  'Primary pitch room slug exposed to investors after publish.';

-- Demo: published so investor dashboard preview works out of the box
update public.investor_experience_profiles
set
  is_published = true,
  published_at = coalesce(published_at, now()),
  active_nda_version = coalesce(active_nda_version, '2026-05-pitchlock-access-standard-v1'),
  pitch_room_slug = coalesce(pitch_room_slug, 'demo')
where presenter_email = 'founder@pitchlock.test';
