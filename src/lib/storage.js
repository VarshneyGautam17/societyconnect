/* localStorage helpers (wrapped: storage can be blocked, and is unavailable during SSR). */
const PREFIX = 'sc_';

export function storageGet(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = window.localStorage.getItem(PREFIX + key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
