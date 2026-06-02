-- Pitch Lock core: subscriptions, pitches, investor access, and pitch access agreements.
-- RLS enabled; server routes use service role (no broad client write policies).

-- ---------------------------------------------------------------------------
-- user_subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  role text not null default 'investor',
  tier text not null default 'free',
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_subscriptions_email_idx on public.user_subscriptions (email);
create index if not exists user_subscriptions_user_id_idx on public.user_subscriptions (user_id);

comment on table public.user_subscriptions is 'Presenter/investor subscription tiers; user_id nullable until auth ships.';

alter table public.user_subscriptions enable row level security;

-- ---------------------------------------------------------------------------
-- pitches
-- ---------------------------------------------------------------------------
create table if not exists public.pitches (
  id uuid primary key default gen_random_uuid(),
  presenter_id uuid,
  presenter_email text,
  title text,
  slug text not null,
  status text not null default 'draft',
  tier_snapshot text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pitches_slug_key unique (slug)
);

create index if not exists pitches_presenter_email_idx on public.pitches (presenter_email);
create index if not exists pitches_status_idx on public.pitches (status);

comment on table public.pitches is 'Protected pitch rooms owned by presenters.';

alter table public.pitches enable row level security;

-- ---------------------------------------------------------------------------
-- pitch_access_agreements (created before pitch_investor_access FK to agreement_id)
-- ---------------------------------------------------------------------------
create table if not exists public.pitch_access_agreements (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid references public.pitches (id) on delete set null,
  presenter_id uuid,
  presenter_email text,
  investor_name text not null,
  investor_email text not null,
  signature text not null,
  agreement_version text not null,
  document_snapshot text not null,
  client_ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  email_status text not null default 'not_sent'
);

create index if not exists pitch_access_agreements_pitch_idx on public.pitch_access_agreements (pitch_id, created_at desc);
create index if not exists pitch_access_agreements_investor_email_idx on public.pitch_access_agreements (investor_email);

comment on table public.pitch_access_agreements is 'Immutable Pitch Access Agreement signatures; inserted via service role API.';

alter table public.pitch_access_agreements enable row level security;

-- ---------------------------------------------------------------------------
-- pitch_investor_access
-- ---------------------------------------------------------------------------
create table if not exists public.pitch_investor_access (
  id uuid primary key default gen_random_uuid(),
  pitch_id uuid not null references public.pitches (id) on delete cascade,
  presenter_id uuid,
  presenter_email text,
  investor_email text not null,
  investor_name text,
  agreement_id uuid references public.pitch_access_agreements (id) on delete set null,
  access_status text not null default 'pending',
  created_at timestamptz not null default now(),
  last_accessed_at timestamptz
);

create index if not exists pitch_investor_access_pitch_idx on public.pitch_investor_access (pitch_id);
create index if not exists pitch_investor_access_investor_email_idx on public.pitch_investor_access (investor_email);
create index if not exists pitch_investor_access_pitch_investor_idx on public.pitch_investor_access (pitch_id, investor_email);

comment on table public.pitch_investor_access is 'Investor invite/access rows linked to signed agreements.';

alter table public.pitch_investor_access enable row level security;

-- ---------------------------------------------------------------------------
-- Demo seed (optional local testing)
-- ---------------------------------------------------------------------------
insert into public.pitches (id, presenter_email, title, slug, status, tier_snapshot)
values (
  'a0000000-0000-4000-8000-000000000001',
  'founder@pitchlock.test',
  'Demo Pitch Room',
  'demo',
  'active',
  'founder'
)
on conflict (slug) do nothing;

insert into public.pitch_investor_access (pitch_id, presenter_email, investor_email, investor_name, access_status)
select
  p.id,
  p.presenter_email,
  'investor@pitchlock.test',
  'Demo Investor',
  'pending'
from public.pitches p
where p.slug = 'demo'
  and not exists (
    select 1 from public.pitch_investor_access a
    where a.pitch_id = p.id and lower(a.investor_email) = 'investor@pitchlock.test'
  );
