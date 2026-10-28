-- SocietyConnect backend schema.
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
--
-- Scope: businesses (vendor listings), enquiries (resident -> vendor messages),
-- events (view/contact tracking for the vendor dashboard). Societies and categories
-- stay as static data in the app (src/data/societies.js, src/data/categories.js) --
-- they're small, fixed lists, not worth a table at this scale.
--
-- "saved" stays client-side (localStorage) -- it's an anonymous per-device resident
-- preference, so it doesn't need an authenticated backend table.

-- ---------------------------------------------------------------------------
-- businesses
-- ---------------------------------------------------------------------------
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  cat text not null,
  society text not null,
  served text[] not null default '{}',
  area text not null default '',
  desc text not null default '' check (char_length(desc) <= 500),
  phone text not null default '',
  whatsapp text not null default '',
  hide_phone boolean not null default true,
  verified boolean not null default false,
  published boolean not null default false,
  offer text not null default '',
  offer_valid text not null default '',
  items jsonb not null default '[]',
  hours jsonb not null default '[]',
  photos jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_society_published_idx on businesses (society) where published;
create index if not exists businesses_cat_idx on businesses (cat);
create index if not exists businesses_owner_idx on businesses (owner_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_set_updated_at on businesses;
create trigger businesses_set_updated_at
  before update on businesses
  for each row execute function set_updated_at();

alter table businesses enable row level security;

-- Anyone (including anonymous residents) can read published listings.
create policy "public can read published businesses"
  on businesses for select
  using (published = true);

-- A signed-in vendor can always read their own listing, published or draft.
create policy "owners can read their own business"
  on businesses for select
  using (auth.uid() = owner_id);

-- A signed-in vendor can create exactly one listing for themselves.
create policy "owners can insert their own business"
  on businesses for insert
  with check (auth.uid() = owner_id);

create policy "owners can update their own business"
  on businesses for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "owners can delete their own business"
  on businesses for delete
  using (auth.uid() = owner_id);

-- One listing per vendor account for v1.
create unique index if not exists businesses_one_per_owner_idx on businesses (owner_id) where owner_id is not null;

-- ---------------------------------------------------------------------------
-- enquiries (resident -> vendor; residents are never authenticated)
-- ---------------------------------------------------------------------------
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  who text not null check (char_length(who) between 1 and 100),
  msg text not null check (char_length(msg) between 1 and 1000),
  status text not null default 'New' check (status in ('New', 'Replied')),
  created_at timestamptz not null default now()
);

create index if not exists enquiries_business_idx on enquiries (business_id, created_at desc);

alter table enquiries enable row level security;

-- Any visitor can submit an enquiry to a published business. Column checks above
-- cap length; add a captcha (e.g. Cloudflare Turnstile) in front of this once
-- traffic is real -- an open insert policy is spammable by design.
create policy "anyone can submit an enquiry"
  on enquiries for insert
  with check (
    exists (select 1 from businesses b where b.id = business_id and b.published = true)
  );

-- Only the business owner can read or update (e.g. mark "Replied") their own enquiries.
create policy "owners can read their own enquiries"
  on enquiries for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "owners can update their own enquiries"
  on enquiries for update
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- events (profile view / WhatsApp tap / call tap -- dashboard analytics)
-- ---------------------------------------------------------------------------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  type text not null check (type in ('view', 'whatsapp', 'call', 'enquiry')),
  created_at timestamptz not null default now()
);

create index if not exists events_business_created_idx on events (business_id, created_at desc);

alter table events enable row level security;

create policy "anyone can record an event"
  on events for insert
  with check (
    exists (select 1 from businesses b where b.id = business_id and b.published = true)
  );

create policy "owners can read their own events"
  on events for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));
