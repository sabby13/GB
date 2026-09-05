-- ============================================================================
--  GlassButterfly · website backend
--  ONE migration — paste this whole file into the Supabase SQL Editor and Run.
--
--  Creates three tables (visitors, downloads, waitlist), useful indexes, and
--  locks them down with Row Level Security so the public website can ONLY
--  INSERT. Reading, updating and deleting are impossible from the browser.
--
--  Safe to run more than once (idempotent).
-- ============================================================================

-- gen_random_uuid() lives in pgcrypto. Present on Supabase by default; this
-- guarantees it.
create extension if not exists pgcrypto;


-- ----------------------------------------------------------------------------
-- 1. visitors  —  one anonymous record per new browser session
-- ----------------------------------------------------------------------------
create table if not exists public.visitors (
  id                uuid        primary key default gen_random_uuid(),
  created_at        timestamptz not null    default now(),
  session_id        uuid,
  browser           text,
  operating_system  text,
  device_type       text,
  language          text,
  timezone          text,
  country           text,
  city              text,
  referrer          text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text
);

create index if not exists visitors_created_at_idx  on public.visitors (created_at desc);
create index if not exists visitors_session_id_idx  on public.visitors (session_id);
create index if not exists visitors_country_idx     on public.visitors (country);
create index if not exists visitors_utm_source_idx  on public.visitors (utm_source);


-- ----------------------------------------------------------------------------
-- 2. downloads  —  one record per Download-button click
-- ----------------------------------------------------------------------------
create table if not exists public.downloads (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  session_id  uuid,
  version     text,
  platform    text,
  browser     text,
  country     text,
  source      text
);

create index if not exists downloads_created_at_idx on public.downloads (created_at desc);
create index if not exists downloads_session_id_idx on public.downloads (session_id);
create index if not exists downloads_version_idx    on public.downloads (version);


-- ----------------------------------------------------------------------------
-- 3. waitlist  —  emails that want GlassButterfly updates
-- ----------------------------------------------------------------------------
create table if not exists public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null    default now(),
  email       text        not null,
  session_id  uuid,
  browser     text,
  country     text,
  confirmed   boolean     not null    default false
);

-- Case-insensitive uniqueness: "A@b.com" and "a@b.com" count as one signup.
create unique index if not exists waitlist_email_unique_idx on public.waitlist (lower(email));
create index        if not exists waitlist_created_at_idx   on public.waitlist (created_at desc);


-- ============================================================================
--  SECURITY  —  Row Level Security: public may INSERT, nothing else.
--
--  With RLS enabled and ONLY an INSERT policy present, SELECT / UPDATE / DELETE
--  have no matching policy and are therefore denied for the anon & authenticated
--  roles used by the publishable key. The service_role key (server only, never
--  in the browser) bypasses RLS for your own admin/reporting use.
-- ============================================================================

alter table public.visitors  enable row level security;
alter table public.downloads enable row level security;
alter table public.waitlist  enable row level security;

-- Grant only the INSERT privilege at the table level (no SELECT ⇒ rows can
-- never be read back, even accidentally).
grant insert on public.visitors  to anon, authenticated;
grant insert on public.downloads to anon, authenticated;
grant insert on public.waitlist  to anon, authenticated;

-- INSERT-only policies. Recreated cleanly so re-running the migration is safe.
drop policy if exists "public can insert visitors"  on public.visitors;
drop policy if exists "public can insert downloads" on public.downloads;
drop policy if exists "public can insert waitlist"  on public.waitlist;

create policy "public can insert visitors"
  on public.visitors  for insert to anon, authenticated with check (true);

create policy "public can insert downloads"
  on public.downloads for insert to anon, authenticated with check (true);

create policy "public can insert waitlist"
  on public.waitlist  for insert to anon, authenticated with check (true);

-- End of migration.
