-- Investor meeting scheduling evidence (ties calendar flow to NDA version). Run in Supabase SQL Editor.

create table if not exists public.meeting_nda_evidence (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  nda_version text not null,
  acknowledged boolean not null default false,
  client_ip text,
  user_agent text,
  room_suffix text
);

create index if not exists meeting_nda_evidence_created_at_idx on public.meeting_nda_evidence (created_at desc);
create index if not exists meeting_nda_evidence_email_idx on public.meeting_nda_evidence (email);
create index if not exists meeting_nda_evidence_email_room_idx
  on public.meeting_nda_evidence (email, room_suffix, created_at desc);

comment on table public.meeting_nda_evidence is 'Recorded when an investor registers before using the embedded calendar; complements NDA / legal gate records.';

comment on column public.meeting_nda_evidence.room_suffix is
  'Part after investor- in the LiveKit room; one per book-a-meeting flow; used in /meet?join=scheduled&room=...';

alter table public.meeting_nda_evidence enable row level security;
