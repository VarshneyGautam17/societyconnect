import { createSelector } from '@reduxjs/toolkit';

/* The one place that decides "what businesses exist": approved listings from Supabase (see
   src/lib/listings.js), plus the vendor's own listing on this device once they've published it.
   Every page selects through this, so a publish from the dashboard/onboarding flow shows up
   everywhere else immediately. */
export const selectAllBusinesses = createSelector(
  [(state) => state.vendor.current, (state) => state.listings.items],
  (vendor, listings) => (vendor && vendor.published ? [vendor, ...listings] : listings)
);

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
