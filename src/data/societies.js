/* The society list lives in Supabase (`societies` table, see supabase/schema.sql) -- vendors add
   them during onboarding, geocoded from their address (src/app/onboarding/actions.js). This
   module holds the in-memory copy everything reads synchronously; it starts empty and
   src/lib/societies.js fills it from the database (or this device's cached copy). */
export const NO_SOCIETIES = [];

let current = NO_SOCIETIES;
const listeners = new Set();

export function getSocieties() {
  return current;
}

/** Replaces the in-memory list and re-renders every component using useSocieties(). */
export function setSocieties(list) {
  if (!Array.isArray(list)) return;
  current = list;
  listeners.forEach((fn) => fn());
}

/** Adds (or refreshes) one society -- e.g. the one a vendor's address just resolved to, so it
 *  shows up straight away without refetching the whole list. */
export function upsertSociety(society) {
  setSocieties([...current.filter((s) => s.id !== society.id), society].sort((a, b) => a.name.localeCompare(b.name)));
}

export function subscribeSocieties(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const PALETTE = [
  { bg: '#E0E7FF', fg: '#4338CA' }, { bg: '#DCFCE7', fg: '#15803D' }, { bg: '#FEF3C7', fg: '#B45309' },
  { bg: '#FCE7F3', fg: '#BE185D' }, { bg: '#E0F2FE', fg: '#0369A1' }, { bg: '#CCFBF1', fg: '#0F766E' },
  { bg: '#FFEDD5', fg: '#C2410C' }, { bg: '#F3E8FF', fg: '#7E22CE' }
];

/** Badge colours for a new society, picked from its id so they stay the same. */
export function societyColors(id) {
  return PALETTE[[...String(id)].reduce((h, c) => h + c.charCodeAt(0), 0) % PALETTE.length];
}

/* Shown for an id that isn't in the list (yet) -- none chosen, or a brand-new society on a
   device that hasn't fetched it. A neutral label beats guessing, which would show the wrong one. */
function unknownSociety(id) {
  return { id, lat: null, lng: null, name: 'Your society', place: '', ...PALETTE[0] };
}

export function socOf(id, list = current) {
  return list.find((s) => s.id === id) || unknownSociety(id);
}

export function socShort(id, list = current) {
  return socOf(id, list).name.replace(' Habitat', '');
}

/** "Name, Area" -- `place` can be empty for an unknown society. */
export function socLabel(id, list = current) {
  const s = socOf(id, list);
  const area = s.place.split(',')[0];
  return area ? `${socShort(id, list)}, ${area}` : socShort(id, list);
}

/** Great-circle distance in km between two lat/lng points (haversine). */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Every society with its distance from a point, nearest first: `[{ society, km }]`. */
export function societiesByDistance(lat, lng, list = current) {
  return list
    .filter((society) => Number.isFinite(society.lat) && Number.isFinite(society.lng))
    .map((society) => ({ society, km: distanceKm(lat, lng, society.lat, society.lng) }))
    .sort((a, b) => a.km - b.km);
}

/** The society closest to a point, with its distance: `{ society, km }`. */
export function nearestSociety(lat, lng, list = current) {
  return societiesByDistance(lat, lng, list)[0];
}
