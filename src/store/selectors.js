import { BUSINESSES } from '@/data/businesses';

/* The one place that decides "what businesses exist": the static sample set, plus the
   resident's own business once they've published it. Every page selects through this, so a
   publish from the dashboard/onboarding flow shows up everywhere else immediately. */
export function selectAllBusinesses(state) {
  const vendor = state.vendor.current;
  return vendor && vendor.published ? [vendor, ...BUSINESSES] : BUSINESSES;
}

export function selectBusinessById(state, id) {
  if (id === 'mine') return state.vendor.current;
  return selectAllBusinesses(state).find((b) => b.id === id);
}

export function selectCountForSociety(state, socId) {
  return selectAllBusinesses(state).filter((b) => b.society === socId).length;
}

export function selectIsSaved(state, id) {
  return state.saved.ids.includes(id);
}
