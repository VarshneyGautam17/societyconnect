/* The one place that decides "what businesses exist": approved listings from Supabase (see
   src/lib/listings.js). The vendor's own copy on this device ("mine") isn't included -- their
   listing shows up here once an admin approves it, as the real row -- but /business/mine still
   previews it for them. */
export const selectAllBusinesses = (state) => state.listings.items;

/** True until the first listings fetch has finished (successfully or not). */
export function selectListingsLoading(state) {
  return state.listings.status === 'idle' || state.listings.status === 'loading';
}

export function selectBusinessById(state, id) {
  if (id === 'mine') return state.vendor.current;
  return selectAllBusinesses(state).find((b) => b.id === id || (b.slug && b.slug === id));
}

export function selectCountForSociety(state, socId) {
  return selectAllBusinesses(state).filter((b) => b.society === socId || b.served?.includes(socId)).length;
}

export function selectIsSaved(state, id) {
  return state.saved.ids.includes(id);
}
