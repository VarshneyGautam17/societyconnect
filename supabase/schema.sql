-- SocietySpot backend schema.
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
  "desc" text not null default '' check (char_length("desc") <= 500),
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
  -- banner: single Cloudinary public_id for the big hero image on the business page.
  -- photos: up to 6 Cloudinary public_ids for the gallery panel. Both client-validated
  -- (image-only, 8MB input cap, recompressed to WebP <=1.5MB) -- see lib/imageUpload.js.
  banner text,
  photos jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent for databases where schema.sql already ran before `banner` existed.
alter table businesses add column if not exists banner text;

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
  -- is_admin() covers app traffic authenticated as an admin; current_user =
  -- 'postgres' covers a direct database connection (the SQL Editor, a
  -- migration/seed script, psql) -- PostgREST/the public API never connects
  -- as that role, only as 'anon' or 'authenticated', so this isn't reachable
  -- by a vendor through the app no matter what they send.
  if is_admin() or current_user = 'postgres' then
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
-- Defense-in-depth input constraints. The app's own forms already restrict
-- category/society to known ids, cap text lengths, and strip non-digits from
-- phone fields -- but client-side validation is not a security boundary:
-- anyone with the public anon key (it's meant to be public; see .env.local)
-- can call the Supabase REST API directly and skip the UI entirely. These
-- CHECK constraints are what actually stop a malformed, oversized, or
-- malicious row from being written, no matter how the request is sent.
-- ---------------------------------------------------------------------------

-- items: jsonb array of [name, note, price] string triples (see
-- DEFAULT_ITEMS / ItemsEditor.jsx). Capped so a scripted insert can't stuff
-- thousands of rows or multi-MB strings into a column every visitor's
-- browser renders on the public business page.
--
-- Note on these three validators: Postgres does NOT guarantee left-to-right
-- short-circuit evaluation of AND/OR (see "Expression Evaluation Rules" in
-- the Postgres docs, which explicitly warns against e.g. `x <> 0 AND y/x > 1`
-- as unsafe) -- so a naive `jsonb_typeof(v) = 'array' and jsonb_array_length(v) <= 30`
-- can still call jsonb_array_length() on a non-array and throw instead of
-- cleanly failing the constraint. Each type check here is its own `if`
-- statement (PL/pgSQL statements always run sequentially) or a `case when`
-- guard, never combined into one boolean expression with the length check.
create or replace function is_valid_items(v jsonb)
returns boolean as $$
begin
  if jsonb_typeof(v) is distinct from 'array' then
    return false;
  end if;
  if jsonb_array_length(v) > 30 then
    return false;
  end if;
  return not exists (
    select 1 from jsonb_array_elements(v) as elem
    where (case when jsonb_typeof(elem) = 'array' then jsonb_array_length(elem) <> 3 else true end)
       or jsonb_typeof(elem->0) is distinct from 'string'
       or jsonb_typeof(elem->1) is distinct from 'string'
       or jsonb_typeof(elem->2) is distinct from 'string'
       or coalesce(char_length(elem->>0), 0) > 120
       or coalesce(char_length(elem->>1), 0) > 200
       or coalesce(char_length(elem->>2), 0) > 40
  );
end;
$$ language plpgsql immutable;

-- hours: jsonb array of up to 7 {day, open, from, to} entries (one per weekday).
-- `elem->'day'` etc. use text-key access, which safely returns NULL (never
-- errors) when elem isn't an object -- no jsonb_array_length call on `elem`
-- here, so no guard needed inside the EXISTS clause.
create or replace function is_valid_hours(v jsonb)
returns boolean as $$
begin
  if jsonb_typeof(v) is distinct from 'array' then
    return false;
  end if;
  if jsonb_array_length(v) > 7 then
    return false;
  end if;
  return not exists (
    select 1 from jsonb_array_elements(v) as elem
    where jsonb_typeof(elem) is distinct from 'object'
       or jsonb_typeof(elem->'day') is distinct from 'string'
       or jsonb_typeof(elem->'open') is distinct from 'boolean'
       or jsonb_typeof(elem->'from') is distinct from 'string'
       or jsonb_typeof(elem->'to') is distinct from 'string'
       or coalesce(char_length(elem->>'day'), 0) > 12
       or coalesce(char_length(elem->>'from'), 0) > 20
       or coalesce(char_length(elem->>'to'), 0) > 20
  );
end;
$$ language plpgsql immutable;

-- photos: jsonb array of up to 6 Cloudinary public_id strings. `elem #>> '{}'`
-- (empty path) safely stringifies any jsonb value, so no guard needed.
create or replace function is_valid_photo_ids(v jsonb)
returns boolean as $$
begin
  if jsonb_typeof(v) is distinct from 'array' then
    return false;
  end if;
  if jsonb_array_length(v) > 6 then
    return false;
  end if;
  return not exists (
    select 1 from jsonb_array_elements(v) as elem
    where jsonb_typeof(elem) is distinct from 'string' or char_length(elem #>> '{}') > 300
  );
end;
$$ language plpgsql immutable;

-- cat/society: must be one of the static ids in src/data/categories.js / societies.js.
alter table businesses drop constraint if exists businesses_cat_check;
alter table businesses add constraint businesses_cat_check
  check (cat in ('food', 'edu', 'beauty', 'fashion', 'grocery', 'home', 'fitness', 'other'));

alter table businesses drop constraint if exists businesses_society_check;
alter table businesses add constraint businesses_society_check
  check (society in ('prestige', 'purva', 'mantri', 'hiranandani', 'magarpatta', 'dlf', 'lodha', 'brigade'));

-- served: every element must be a known society id; capped at the total number of societies
-- (8) so it can't be inflated with repeats -- array_length is null for an empty array in
-- Postgres, hence the "is null or" branch.
alter table businesses drop constraint if exists businesses_served_check;
alter table businesses add constraint businesses_served_check
  check (
    served <@ array['prestige', 'purva', 'mantri', 'hiranandani', 'magarpatta', 'dlf', 'lodha', 'brigade']::text[]
    and (array_length(served, 1) is null or array_length(served, 1) <= 8)
  );

alter table businesses drop constraint if exists businesses_area_check;
alter table businesses add constraint businesses_area_check check (char_length(area) <= 120);

-- phone/whatsapp: the app stores a formatted, sometimes masked display string
-- (e.g. "+91 98XXX XXX10"), not a raw digit string -- this allows that shape
-- while still capping length and rejecting embedded junk/markup.
alter table businesses drop constraint if exists businesses_phone_check;
alter table businesses add constraint businesses_phone_check check (phone ~ '^[0-9+Xx() .-]{0,20}$');

alter table businesses drop constraint if exists businesses_whatsapp_check;
alter table businesses add constraint businesses_whatsapp_check check (whatsapp ~ '^[0-9+Xx() .-]{0,20}$');

alter table businesses drop constraint if exists businesses_offer_check;
alter table businesses add constraint businesses_offer_check check (char_length(offer) <= 200);

alter table businesses drop constraint if exists businesses_offer_valid_check;
alter table businesses add constraint businesses_offer_valid_check check (char_length(offer_valid) <= 100);

alter table businesses drop constraint if exists businesses_rejection_reason_check;
alter table businesses add constraint businesses_rejection_reason_check check (char_length(rejection_reason) <= 500);

alter table businesses drop constraint if exists businesses_banner_check;
alter table businesses add constraint businesses_banner_check check (banner is null or char_length(banner) <= 300);

alter table businesses drop constraint if exists businesses_items_check;
alter table businesses add constraint businesses_items_check check (is_valid_items(items));

alter table businesses drop constraint if exists businesses_hours_check;
alter table businesses add constraint businesses_hours_check check (is_valid_hours(hours));

alter table businesses drop constraint if exists businesses_photos_check;
alter table businesses add constraint businesses_photos_check check (is_valid_photo_ids(photos));

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

-- Blunt flood guard: this is not a substitute for a real captcha (there's no
-- way to distinguish requests by caller here, only by business_id), but it
-- caps the damage a single scripted loop can do to one business's inbox.
create or replace function limit_enquiry_rate()
returns trigger as $$
begin
  if (select count(*) from enquiries where business_id = new.business_id and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'Too many enquiries sent just now. Please try again in a minute.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists enquiries_rate_limit on enquiries;
create trigger enquiries_rate_limit
  before insert on enquiries
  for each row execute function limit_enquiry_rate();

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

-- Caps scripted flooding of a single business's analytics; generous enough
-- (120/minute) not to interfere with genuine traffic on a popular listing.
create or replace function limit_event_rate()
returns trigger as $$
begin
  if (select count(*) from events where business_id = new.business_id and created_at > now() - interval '1 minute') >= 120 then
    raise exception 'Too many events recorded just now.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists events_rate_limit on events;
create trigger events_rate_limit
  before insert on events
  for each row execute function limit_event_rate();

create policy "owners can read their own events"
  on events for select
  using (exists (select 1 from businesses b where b.id = business_id and b.owner_id = auth.uid()));

create policy "admins can read all events"
  on events for select
  using (is_admin());
