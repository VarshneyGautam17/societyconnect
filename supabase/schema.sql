-- SocietyConnect backend schema.
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
--
-- Scope: businesses (vendor listings, with an admin approval lifecycle),
-- enquiries (resident -> vendor messages), events (view/contact tracking),
-- admins (who can access /admin). Societies and categories stay as static
-- data in the app (src/data/societies.js, src/data/categories.js) -- small,
-- fixed lists, not worth a table at this scale.
--
-- "saved" stays client-side (localStorage) -- it's an anonymous per-device
-- resident preference, so it doesn't need an authenticated backend table.

-- ---------------------------------------------------------------------------
-- admins -- who can access /admin. Membership is managed by hand (insert a
-- row via the SQL Editor after a person signs up through normal Supabase
-- Auth) -- there's no self-service "become an admin" path anywhere.
-- ---------------------------------------------------------------------------
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- An admin can see who else is an admin; nobody else can read this table at all.
create policy "admins can read the admin list"
  on admins for select
  using (exists (select 1 from admins a where a.user_id = auth.uid()));

create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$ language sql stable security definer set search_path = public;

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
  -- Vendor-facing description. May contain the app's small safe rich-text
  -- syntax (**bold**, ==highlight==, __underline__) -- parsed client-side
  -- into styled spans, never rendered as raw HTML. See src/lib/richText.js.
  desc text not null default '' check (char_length(desc) <= 500),
  phone text not null default '',
  whatsapp text not null default '',
  hide_phone boolean not null default true,
  verified boolean not null default false,
  -- Admin approval lifecycle. A vendor's insert/update always lands as
  -- 'pending' or keeps the existing status -- only an admin can move a
  -- listing to 'approved'/'rejected'/'disabled' (enforced by the trigger
  -- below, not just by RLS, since RLS alone doesn't restrict column values).
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'disabled')),
  rejection_reason text not null default '',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  offer text not null default '',
  offer_valid text not null default '',
  items jsonb not null default '[]',
  hours jsonb not null default '[]',
  photos jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_society_status_idx on businesses (society) where status = 'approved';
create index if not exists businesses_status_idx on businesses (status);
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

-- Column-level protection for the approval workflow: a non-admin can never
-- set their own status (or back-date reviewed_at/reviewed_by). On insert
-- their row always starts 'pending'; on update, status/review fields are
-- silently pinned back to whatever they already were. Admins are unrestricted.
create or replace function protect_business_review_fields()
returns trigger as $$
begin
  if is_admin() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.status := 'pending';
    new.reviewed_by := null;
    new.reviewed_at := null;
    new.rejection_reason := '';
    new.verified := false;
  else
    new.status := old.status;
    new.reviewed_by := old.reviewed_by;
    new.reviewed_at := old.reviewed_at;
    new.rejection_reason := old.rejection_reason;
    new.verified := old.verified;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists businesses_protect_review_fields on businesses;
create trigger businesses_protect_review_fields
  before insert or update on businesses
  for each row execute function protect_business_review_fields();

alter table businesses enable row level security;

-- Anyone (including anonymous residents) can read approved listings.
create policy "public can read approved businesses"
  on businesses for select
  using (status = 'approved');

-- A signed-in vendor can always read their own listing, whatever its status.
create policy "owners can read their own business"
  on businesses for select
  using (auth.uid() = owner_id);

-- A signed-in vendor can create exactly one listing for themselves (status
-- is forced to 'pending' by the trigger above regardless of what they send).
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

-- Admins can read, edit, and permanently delete any listing, approved or not.
create policy "admins can read all businesses"
  on businesses for select
  using (is_admin());

create policy "admins can update any business"
  on businesses for update
  using (is_admin())
  with check (is_admin());

create policy "admins can delete any business"
  on businesses for delete
  using (is_admin());

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

-- Any visitor can submit an enquiry to an approved business. Column checks
-- above cap length; add a captcha (e.g. Cloudflare Turnstile) in front of
-- this once traffic is real -- an open insert policy is spammable by design.
create policy "anyone can submit an enquiry"
  on enquiries for insert
  with check (
    exists (select 1 from businesses b where b.id = business_id and b.status = 'approved')
  );

-- Only the business owner can read or update (e.g. mark "Replied") their own enquiries.
create policy "owners can read their own enquiries"
  on enquiries for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "owners can update their own enquiries"
  on enquiries for update
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()))
  with check (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

-- Admins can read every enquiry, for the data export.
create policy "admins can read all enquiries"
  on enquiries for select
  using (is_admin());

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
    exists (select 1 from businesses b where b.id = business_id and b.status = 'approved')
  );

create policy "owners can read their own events"
  on events for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "admins can read all events"
  on events for select
  using (is_admin());
