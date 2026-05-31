-- PitchLock multi-tenant registry. Run ONCE in the Supabase SQL Editor.
-- Adds a project registry + nullable project_id on existing tables, seeds the default
-- `parable-seed` tenant with the canonical design tokens, and BACKFILLS all existing
-- rows to `parable-seed` so verify-join / status checks keep working for current data.
--
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / ON CONFLICT / guarded backfill).

-- 1. Master project control table (public schema — same as legal_signatures, etc.)
create table if not exists public.pitchlock_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  project_name text not null,
  prototype_url text,

  -- White-label landing copy
  presenter_name text,           -- e.g. "SecuraFin-AI, LLC"
  headline_suffix text,          -- rendered after "The " in the hero
  tagline text,                  -- italic quote under the headline
  value_statement text,          -- supporting sentence
  footer_left text,
  footer_right text,

  -- Canonical design tokens (CSS custom properties applied by [projectSlug]/layout.tsx)
  theme_bg text default '#080A0C',       -- --bg-canvas  (Premium Dark Canvas)
  theme_panel text default '#0B0E11',    -- --bg-panel   (Deep High-Contrast Panel)
  theme_border text default '#191F24',   -- --border-grid (Subtle Structural Border)
  theme_accent text default '#00F2FF',   -- --color-accent (Glowing Cyber Cyan / Parable Teal)
  theme_success text default '#00E165',  -- --color-success (High-Velocity Kick Green)
  theme_text text default '#EFF1F6',     -- --text-baseline (Ultra-Crisp Soft Off-White)

  created_at timestamptz not null default now()
);

create index if not exists pitchlock_projects_slug_idx on public.pitchlock_projects (slug);

comment on table public.pitchlock_projects is
  'PitchLock white-label tenant registry: per-project branding, prototype URL, and design tokens.';

alter table public.pitchlock_projects enable row level security;
-- No policies: end-user keys denied; server routes read via SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

-- 2. Seed the default tenant with the flagship deck's canonical tokens.
insert into public.pitchlock_projects (
  slug, project_name, presenter_name, headline_suffix, tagline, value_statement,
  footer_left, footer_right,
  theme_bg, theme_panel, theme_border, theme_accent, theme_success, theme_text
)
values (
  'parable-seed',
  'Parable',
  'Parable Investments',
  'Parable Network',
  'The future of faith has a platform.',
  'Building the infrastructure layer of the global faith economy.',
  'Faith. Finance. Technology.',
  'United For Kingdom Impact.',
  '#080A0C', '#0B0E11', '#191F24', '#00F2FF', '#00E165', '#EFF1F6'
)
on conflict (slug) do nothing;

-- 3. Add nullable tenant binding to existing tables (nullable so current writes never break).
alter table public.legal_signatures    add column if not exists project_id uuid references public.pitchlock_projects(id);
alter table public.investor_agreements add column if not exists project_id uuid references public.pitchlock_projects(id);
alter table public.meeting_nda_evidence add column if not exists project_id uuid references public.pitchlock_projects(id);

create index if not exists legal_signatures_project_idx     on public.legal_signatures (project_id);
create index if not exists investor_agreements_project_idx  on public.investor_agreements (project_id);
create index if not exists meeting_nda_evidence_project_idx on public.meeting_nda_evidence (project_id);

-- 4. Backfill existing rows to `parable-seed` BEFORE any read path filters on project_id.
do $$
declare
  seed_id uuid;
begin
  select id into seed_id from public.pitchlock_projects where slug = 'parable-seed';
  if seed_id is not null then
    update public.legal_signatures     set project_id = seed_id where project_id is null;
    update public.investor_agreements  set project_id = seed_id where project_id is null;
    update public.meeting_nda_evidence set project_id = seed_id where project_id is null;
  end if;
end $$;

-- PostgREST: refresh schema cache so the new columns are queryable immediately.
notify pgrst, 'reload schema';
