-- Investor Experience Profile — presenter personalization for investor dashboard

create table if not exists public.investor_experience_profiles (
  id uuid primary key default gen_random_uuid(),
  presenter_id uuid,
  presenter_email text not null,
  business_name text,
  tagline text,
  industry text,
  funding_stage text,
  raise_amount text,
  minimum_investment text,
  founder_name text,
  founder_title text,
  founder_photo_url text,
  founder_bio text,
  welcome_message text,
  hero_cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investor_experience_profiles_presenter_email_key unique (presenter_email)
);

create index if not exists investor_experience_profiles_email_idx
  on public.investor_experience_profiles (presenter_email);

comment on table public.investor_experience_profiles is
  'Presenter-defined investor dashboard personalization; one row per presenter email.';

alter table public.investor_experience_profiles enable row level security;

-- Demo seed for local / investor dashboard preview
insert into public.investor_experience_profiles (
  presenter_email,
  business_name,
  tagline,
  industry,
  funding_stage,
  raise_amount,
  minimum_investment,
  founder_name,
  founder_title,
  founder_bio,
  welcome_message
)
values (
  'founder@pitchlock.test',
  'Pitch Lock',
  'Pitch. Protect. Progress.',
  'Enterprise SaaS · Security',
  'Seed',
  '$2.5M',
  '$25,000',
  'Kym Feltus',
  'Founder & CEO',
  'Building the secure layer between founders and investors — private rooms, verified access, and calm investor experiences.',
  'Thank you for taking the time to review our opportunity. This is your private space to explore the pitch, ask questions, and connect on your timeline.'
)
on conflict (presenter_email) do nothing;
