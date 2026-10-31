import 'server-only';

/* Geoapify geocoding (OpenStreetMap data), used to verify a vendor's society address and get
   its coordinates. Server-only so GEOAPIFY_API_KEY never reaches the browser.

   Many Indian societies aren't in OpenStreetMap by name, so "the society itself was found" is
   too strict on its own -- a real society on a real road would be rejected. An address is
   accepted when either:
     - the society/building itself matched with high confidence, or
     - its street/locality matched exactly, in the right city, with a PIN in the same postal
       district (first 3 digits -- OSM's PIN data is patchy, so an exact match would reject
       real addresses).
   Made-up roads only partially match (street confidence ~0.5) and gibberish returns nothing,
   so both are rejected. */

const ENDPOINT = 'https://api.geoapify.com/v1/geocode/search';
const PLACE_TYPES = new Set(['building', 'amenity']);

export function geoapifyConfigured() {
  return Boolean(process.env.GEOAPIFY_API_KEY);
}

async function search(params) {
  const url = new URL(ENDPOINT);
  Object.entries({ ...params, filter: 'countrycode:in', format: 'json', limit: '5', lang: 'en', apiKey: process.env.GEOAPIFY_API_KEY })
    .forEach(([k, v]) => v && url.searchParams.set(k, v));
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Geoapify ${res.status}`);
  const json = await res.json();
  return json.results || [];
}

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

function cityMatches(result, city) {
  const want = norm(city);
  /* Bengaluru/Bangalore, Gurugram/Gurgaon etc. -- OSM uses either spelling, so compare loosely
     across every admin field the result has rather than the `city` field alone. */
  const aliases = { bengaluru: 'bangalore', gurugram: 'gurgaon', mumbai: 'bombay', kolkata: 'calcutta', chennai: 'madras' };
  const variants = [want, aliases[want], Object.keys(aliases).find((k) => aliases[k] === want)].filter(Boolean);
  const fields = [result.city, result.county, result.state_district, result.district, result.municipality, result.suburb, result.town, result.village].map(norm);
  return fields.some((f) => f && variants.some((v) => f.includes(v) || v.includes(f)));
}

function pinMatches(result, pincode) {
  return !result.postcode || norm(result.postcode).slice(0, 3) === pincode.slice(0, 3);
}

function accept(result, { city, pincode }) {
  const rank = result.rank || {};
  if (!cityMatches(result, city) || !pinMatches(result, pincode)) return null;
  if (PLACE_TYPES.has(result.result_type) && rank.confidence >= 0.8) return 'society';
  if ((rank.confidence_street_level ?? 0) >= 0.9 && (rank.confidence_city_level ?? 0) >= 0.9) return 'street';
  return null;
}

/** Verifies a society address. Resolves `{ lat, lng, level, formatted, suburb, city, postcode }`
 *  (`level` is 'society' or 'street': how precise the coordinates are), or `null` when the
 *  address couldn't be verified. Throws only on a network/API failure. */
export async function geocodeSocietyAddress({ name, street, city, pincode }) {
  /* Structured first (separate fields score each part on its own -- see the rules above), then
     the whole address as free text, which sometimes finds named places structured search
     misses. */
  const attempts = [
    { name, street, city, postcode: pincode, country: 'India' },
    { text: `${name}, ${street}, ${city} ${pincode}, India` }
  ];
  for (const params of attempts) {
    const results = await search(params);
    for (const r of results) {
      const level = accept(r, { city, pincode });
      if (level) {
        return {
          lat: r.lat,
          lng: r.lon,
          level,
          formatted: r.formatted || '',
          suburb: r.suburb || r.district || r.street || '',
          city: r.city || city,
          postcode: r.postcode || pincode
        };
      }
    }
  }
  return null;
}
