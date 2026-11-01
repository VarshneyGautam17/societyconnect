'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { societyColors } from '@/data/societies';
import { slugify } from '@/lib/slugify';
import { sendOtp, verifyOtp } from '@/lib/otp';

/** Verifies the vendor actually controls the mobile number they're onboarding with, using the
 *  same WhatsApp OTP flow (and the same approved template) as resident login -- see
 *  src/lib/otp.js. No session/cookie comes out of this (onboarding doesn't need one; the
 *  listing itself stays unauthenticated, see submitListing in listing.js), it just confirms the
 *  number before step 1. */
export async function sendOnboardingOtp(phone) {
  return sendOtp(phone, 'onboarding');
}

export async function verifyOnboardingOtp(phone, code) {
  return verifyOtp(phone, code);
}

/* Vendor onboarding, "Where are you?" step: the vendor's society is looked up -- or created --
   in the `societies` table from the address they typed, no geocoding involved. The society
   list, and its coordinates, grow with every vendor and every admin review (see
   src/app/admin/actions.js: an admin fills in lat/lng by hand, once per society, the first time
   one of its businesses comes up for approval).
   Writes go through the service-role client: `societies` is publicly readable but has no insert
   policy (see supabase/schema.sql), so this is the only way a row gets in.
   Returns { error } instead of throwing, for the same reason as src/app/access/actions.js. */

/* Same society entered twice (maybe with a slightly different spelling or extra "The"/"CHS")?
   Match loosely on name, but only within the same city -- there's no coordinate to narrow a
   search radius with once geocoding is gone, so city is the next best anchor. */
const COLUMNS = 'id, name, place, street, city, pincode, lat, lng, bg, fg';

const clean = (s, max) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);
const normName = (s) => String(s || '').toLowerCase().replace(/\b(the|society|apartments?|residency|chs|cghs)\b/g, '').replace(/[^a-z0-9]/g, '');
const normCity = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function sameName(a, b) {
  const x = normName(a);
  const y = normName(b);
  return Boolean(x && y) && (x === y || (Math.min(x.length, y.length) >= 6 && (x.includes(y) || y.includes(x))));
}

/* Bengaluru/Bangalore, Gurugram/Gurgaon etc. -- vendors type either spelling. */
const CITY_ALIASES = { bengaluru: 'bangalore', gurugram: 'gurgaon', mumbai: 'bombay', kolkata: 'calcutta', chennai: 'madras' };
function sameCity(a, b) {
  const x = normCity(a);
  const y = normCity(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const alias = CITY_ALIASES[x] || Object.keys(CITY_ALIASES).find((k) => CITY_ALIASES[k] === x);
  return alias === y;
}

async function uniqueId(supabase, name, city) {
  const base = slugify(name) || 'society';
  const candidates = [base, slugify(`${name} ${city}`), `${base}-${Math.random().toString(36).slice(2, 6)}`];
  const { data } = await supabase.from('societies').select('id').in('id', candidates);
  const taken = new Set((data || []).map((r) => r.id));
  return candidates.find((c) => !taken.has(c)) || `${base}-${Date.now().toString(36)}`;
}

/** Looks up the vendor's society by name + city, or creates it (coordinates left unset -- an
 *  admin fills them in later), and returns the matching row:
 *  `{ society: { id, name, place, street, city, pincode, lat, lng, bg, fg } }`, or `{ error,
 *  field? }` -- `field` names the input to highlight. */
export async function resolveVendorSociety(input) {
  const name = clean(input?.name, 120);
  const street = clean(input?.street, 160);
  const city = clean(input?.city, 80);
  const pincode = String(input?.pincode || '').replace(/\D/g, '');

  if (name.length < 2) return { error: 'Enter your society name.', field: 'societyName' };
  if (street.length < 3) return { error: 'Enter the street or locality.', field: 'street' };
  if (city.length < 2) return { error: 'Enter your city.', field: 'city' };
  if (!/^[1-9]\d{5}$/.test(pincode)) return { error: 'Enter a valid 6-digit PIN code.', field: 'pincode' };

  const supabase = createServiceRoleClient();

  const { data: candidates, error: candidatesError } = await supabase.from('societies').select(COLUMNS);
  if (candidatesError) return { error: 'Something went wrong. Try again.' };

  const existing = candidates.find((s) => sameName(s.name, name) && sameCity(s.city, city));
  if (existing) return { society: existing };

  const id = await uniqueId(supabase, name, city);
  const row = {
    id,
    name,
    place: [street, city].filter(Boolean).join(', ').slice(0, 160),
    street,
    city,
    pincode,
    ...societyColors(id)
  };
  const { data: created, error: insertError } = await supabase.from('societies').insert(row).select(COLUMNS).single();
  if (insertError) {
    console.error('[onboarding] could not save society:', insertError);
    return { error: 'Something went wrong saving your society. Try again.' };
  }
  return { society: created };
}
