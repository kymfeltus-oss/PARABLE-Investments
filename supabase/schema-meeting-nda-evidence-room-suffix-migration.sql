-- Add per–book-a-meeting room suffix (after investor- in LiveKit). Run once in Supabase SQL on existing projects.

alter table public.meeting_nda_evidence add column if not exists room_suffix text;

-- Legacy rows: single shared “scheduled” room (same behavior as pre-generated IDs)
update public.meeting_nda_evidence
set room_suffix = 'scheduled-call'
where room_suffix is null
   or trim(room_suffix) = '';

create index if not exists meeting_nda_evidence_email_room_idx
  on public.meeting_nda_evidence (email, room_suffix, created_at desc);

comment on column public.meeting_nda_evidence.room_suffix is
  'LiveKit room slug without the investor- prefix; unique per registration, used in /meet?join=scheduled&room=…';

-- Optional: require value for all future inserts (fails if any row still null)
-- alter table public.meeting_nda_evidence alter column room_suffix set not null;
