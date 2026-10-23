-- Optional starter schema. The current website does not use this database yet.
create extension if not exists pgcrypto;

create table if not exists public.app_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{}'::jsonb,
  summary jsonb not null default '{}'::jsonb,
  status text not null default 'in-development'
    check (status in ('released', 'in-development', 'archived')),
  repository_url text,
  website_url text,
  privacy_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  app_slug text,
  sender_email text not null,
  subject text not null,
  message text not null,
  status text not null default 'open'
    check (status in ('open', 'in-progress', 'resolved', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.app_catalog enable row level security;
alter table public.support_tickets enable row level security;

-- Public catalog read policy. Write access must be added only for an authenticated
-- admin role after authentication and authorization are implemented.
drop policy if exists "Public can read app catalog" on public.app_catalog;
create policy "Public can read app catalog"
  on public.app_catalog for select using (true);

-- No public insert/select policy is created for support tickets by design.
-- Implement a validated Edge Function with rate limiting and spam protection
-- before accepting support requests from the public website.
