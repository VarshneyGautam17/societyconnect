'use client';

import { useSyncExternalStore } from 'react';
import { getCachedSocieties } from '@/lib/societiesServer';
import { getSocieties, setSocieties, subscribeSocieties, NO_SOCIETIES } from '@/data/societies';
import { storageGet, storageSet } from '@/lib/storage';

let loading = null;

/** Loads the list cached on this device (instant, before any network) -- called once by
 *  Providers before the app renders, so returning visitors see their societies immediately. */
export function primeSocieties() {
  setSocieties(storageGet('societies', null));
}

/** Fetches the society list once per page load (later calls share the same promise) via
 *  getCachedSocieties (src/lib/societiesServer.js), which itself is cached on the server for
 *  10 minutes -- so this is a Supabase query roughly once per 10 minutes total, not once per
 *  visitor per load. Resolves to the list; on a network/database failure it resolves to
 *  whatever is already in memory rather than rejecting. */
export function loadSocieties() {
  if (!loading) {
    loading = getCachedSocieties().then((data) => {
      setSocieties(data);
      storageSet('societies', data);
      return data;
    }, () => {
      loading = null; // let a later call retry
      return getSocieties();
    });
  }
  return loading;
}

/** The current society list; re-renders the component whenever it changes. */
export function useSocieties() {
  return useSyncExternalStore(subscribeSocieties, getSocieties, () => NO_SOCIETIES);
}
