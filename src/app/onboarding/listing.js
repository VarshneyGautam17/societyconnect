'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { CATEGORIES } from '@/data/categories';
import { slugify } from '@/lib/slugify';

/* Saves a vendor's onboarding submission as a `businesses` row for admin review. Runs with the
   service-role key (vendors have no Supabase account yet), so everything the browser sends is
   re-validated here -- this is the only gate. The status can't be chosen by the caller either:
   the protect_business_review_fields trigger (supabase/schema.sql) forces every new row to
   'pending', which is what puts it in /admin/vendors.
   Returns { error, field? } instead of throwing, like the other actions in this app. */

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));
const DAYS = new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

const text = (s, max) => String(s ?? '').trim().slice(0, max);
const line = (s, max) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const isId = (s) => typeof s === 'string' && s.length > 0 && s.length <= 300;

/** "9876543210" (or "+91 98765 43210") -> "+91 98765 43210"; null if not an Indian mobile. */
function formatMobile(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(-10);
  return /^[6-9]\d{9}$/.test(digits) ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : null;
}

function cleanItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((r) => Array.isArray(r) && line(r[0], 120))
    .slice(0, 30)
    .map((r) => [line(r[0], 120), line(r[1], 200), line(r[2], 40) || 'On request']);
}

function cleanHours(hours) {
  if (!Array.isArray(hours)) return [];
  return hours
    .filter((h) => h && DAYS.has(h.day))
    .slice(0, 7)
    .map((h) => ({ day: h.day, open: h.open === true, from: line(h.from, 20), to: line(h.to, 20) }));
}

export async function submitListing(v) {
  const name = line(v?.name, 120);
  const slug = slugify(v?.slug);
  const whatsapp = formatMobile(v?.whatsapp);
  const phone = formatMobile(v?.phone) || whatsapp;
  const society = typeof v?.society === 'string' ? v.society : '';
  const items = cleanItems(v?.items);

  if (!name) return { error: 'Add your business name.', field: 'name' };
  if (!slug) return { error: 'Choose a web address for your page.', field: 'slug' };
  if (!CATEGORY_IDS.has(v?.cat)) return { error: 'Choose a category.', field: 'cat' };
  if (!whatsapp) return { error: 'Enter a valid 10-digit WhatsApp number.', field: 'whatsapp' };
  if (!society) return { error: 'Please confirm your society address.', field: 'address' };
  if (!items.length) return { error: 'Add at least one item or service.', field: 'items' };

  const served = [...new Set([society, ...(Array.isArray(v?.served) ? v.served : [])].filter((s) => typeof s === 'string' && s))].slice(0, 50);
  const offer = line(v?.offer, 200);

  const supabase = createServiceRoleClient();

  /* One live-or-waiting listing per WhatsApp number -- stops double submits and the same
     vendor flooding the review queue. A rejected listing doesn't count, so they can resubmit. */
  const { data: existing, error: existingError } = await supabase
    .from('businesses')
    .select('id, status')
    .eq('whatsapp', whatsapp)
    .in('status', ['pending', 'approved'])
    .limit(1);
  if (existingError) {
    console.error('[onboarding] could not check existing listings:', existingError);
    return { error: 'Something went wrong. Try again.' };
  }
  if (existing.length) {
    return {
      error: existing[0].status === 'pending'
        ? 'A listing with this WhatsApp number is already waiting for review.'
        : 'A business with this WhatsApp number is already listed.'
    };
  }

  const row = {
    owner_id: null,
    name,
    slug,
    cat: v.cat,
    society,
    served,
    area: line(v?.area, 120),
    desc: text(v?.desc, 500),
    phone,
    whatsapp,
    hide_phone: v?.hidePhone !== false,
    offer,
    offer_valid: offer ? line(v?.offerValid, 100) : '',
    items,
    hours: cleanHours(v?.hours),
    banner: isId(v?.banner) ? v.banner : null,
    photos: Array.isArray(v?.photos) ? v.photos.filter(isId).slice(0, 6) : []
  };

  const { data, error } = await supabase.from('businesses').insert(row).select('id, status').single();
  if (error) {
    if (error.code === '23505') return { error: 'That page link is already taken. Choose another one.', field: 'slug' };
    if (error.code === '23503') return { error: 'Please confirm your society address again.', field: 'address' };
    console.error('[onboarding] could not save listing:', error);
    return { error: 'Something went wrong saving your listing. Try again.' };
  }
  return { id: data.id, status: data.status };
}

/** Everything the vendor's dashboard needs about a submitted listing, in one round trip:
 *  review status (`{ status, reason }`, null if the listing no longer exists -- deleted by an
 *  admin) plus real analytics read straight from `events`/`enquiries` (see supabase/schema.sql).
 *  Same no-login, lookup-by-id trust model throughout, since vendors don't have a Supabase auth
 *  session to satisfy the owner_id RLS policies. `stats` is null on a lookup failure so the
 *  caller can keep showing the last good numbers. */
export async function getListingData(id) {
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = createServiceRoleClient();
  const since = new Date(Date.now() - 30 * 86400000).toISOString();

  const [{ data: business }, { data: events, error: eventsError }, { data: enquiries, error: enquiriesError }] = await Promise.all([
    supabase.from('businesses').select('status, rejection_reason').eq('id', id).maybeSingle(),
    supabase.from('events').select('type, created_at').eq('business_id', id).gte('created_at', since),
    supabase.from('enquiries').select('who, msg, status, created_at').eq('business_id', id).order('created_at', { ascending: false }).limit(50)
  ]);

  const status = business ? { status: business.status, reason: business.rejection_reason || '' } : null;

  if (eventsError || enquiriesError) {
    console.error('[dashboard] could not load stats:', eventsError || enquiriesError);
    return { status, stats: null };
  }

  const n = (type) => events.filter((e) => e.type === type).length;
  const bars = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const next = day.getTime() + 86400000;
    const inDay = events.filter((e) => {
      const t = new Date(e.created_at).getTime();
      return t >= day.getTime() && t < next;
    });
    bars.push({
      day: String(day.getDate()),
      v: inDay.filter((e) => e.type === 'view').length,
      c: inDay.filter((e) => e.type !== 'view').length
    });
  }

  const stats = {
    views: n('view'),
    wa: n('whatsapp'),
    call: n('call'),
    enqN: enquiries.length,
    bars,
    enquiriesView: enquiries.map((e) => ({
      who: e.who,
      msg: e.msg,
      when: new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      status: e.status
    }))
  };

  return { status, stats };
}
