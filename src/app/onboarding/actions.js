'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { geoapifyConfigured, geocodeSocietyAddress } from '@/lib/geoapify';
import { distanceKm, societyColors } from '@/data/societies';
import { slugify } from '@/lib/slugify';

/* Vendor onboarding, "Where are you?" step: the vendor's society address is geocoded (see
   src/lib/geoapify.js) and the society is looked up -- or created -- in the `societies` table,
   so the society list, its coordinates and "nearest society" detection grow with every vendor.
   Writes go through the service-role client: `societies` is publicly readable but has no write
   policies (see supabase/schema.sql), so this verified path is the only way a row gets in.
   Returns { error } instead of throwing, for the same reason as src/app/access/actions.js. */

/* Same society entered twice? Names are compared loosely, and only against societies within
   this radius -- street-level coordinates for one society can land a km or two apart. */
const SAME_SOCIETY_KM = 3;
const COLUMNS = 'id, name, place, lat, lng, bg, fg';

const clean = (s, max) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, max);
const normName = (s) => String(s || '').toLowerCase().replace(/\b(the|society|apartments?|residency|chs|cghs)\b/g, '').replace(/[^a-z0-9]/g, '');

function sameName(a, b) {
  const x = normName(a);
  const y = normName(b);
  return Boolean(x && y) && (x === y || (Math.min(x.length, y.length) >= 6 && (x.includes(y) || y.includes(x))));
}

async function uniqueId(supabase, name, city) {
  const base = slugify(name) || 'society';
  const candidates = [base, slugify(`${name} ${city}`), `${base}-${Math.random().toString(36).slice(2, 6)}`];
  const { data } = await supabase.from('societies').select('id').in('id', candidates);
  const taken = new Set((data || []).map((r) => r.id));
  return candidates.find((c) => !taken.has(c)) || `${base}-${Date.now().toString(36)}`;
}

/** Verifies the vendor's society address and returns the matching society row:
 *  `{ society: { id, name, place, lat, lng, bg, fg } }`, or `{ error, field? }` -- `field`
 *  names the input to highlight. */
export async function resolveVendorSociety(input) {
  const name = clean(input?.name, 120);
  const street = clean(input?.street, 160);
  const city = clean(input?.city, 80);
  const pincode = String(input?.pincode || '').replace(/\D/g, '');

  if (name.length < 2) return { error: 'Enter your society name.', field: 'societyName' };
  if (street.length < 3) return { error: 'Enter the street or locality.', field: 'street' };
  if (city.length < 2) return { error: 'Enter your city.', field: 'city' };
  if (!/^[1-9]\d{5}$/.test(pincode)) return { error: 'Enter a valid 6-digit PIN code.', field: 'pincode' };
  if (!geoapifyConfigured()) return { error: 'Address check is not set up yet. Please try again later.' };

  let geo;
  try {
    geo = await geocodeSocietyAddress({ name, street, city, pincode });
  } catch (err) {
    console.error('[onboarding] geocoding failed:', err);
    return { error: 'Could not check your address right now. Please try again in a minute.' };
  }
  if (!geo) {
    return { error: 'We could not find this address on the map. Check the street or locality, city and PIN code, then try again.' };
  }

  const supabase = createServiceRoleClient();

  /* Reuse an existing society with the same name nearby -- a ~0.05 degree box (about 5 km)
     around the point narrows the candidates before the exact distance check. */
  const box = 0.05;
  const { data: nearby, error: nearbyError } = await supabase
    .from('societies')
    .select(COLUMNS)
    .gte('lat', geo.lat - box).lte('lat', geo.lat + box)
    .gte('lng', geo.lng - box).lte('lng', geo.lng + box);
  if (nearbyError) return { error: 'Something went wrong. Try again.' };

  const existing = nearby.find((s) => sameName(s.name, name) && distanceKm(geo.lat, geo.lng, s.lat, s.lng) <= SAME_SOCIETY_KM);
  if (existing) return { society: existing };

  const id = await uniqueId(supabase, name, city);
  const row = {
    id,
    name,
    place: [geo.suburb, geo.city].filter(Boolean).join(', ').slice(0, 160),
    street,
    city: geo.city.slice(0, 80),
    pincode,
    formatted_address: geo.formatted.slice(0, 300),
    lat: geo.lat,
    lng: geo.lng,
    geo_level: geo.level,
    ...societyColors(id)
  };
  const { data: created, error: insertError } = await supabase.from('societies').insert(row).select(COLUMNS).single();
  if (insertError) {
    console.error('[onboarding] could not save society:', insertError);
    return { error: 'Something went wrong saving your society. Try again.' };
  }
  return { society: created };
}
