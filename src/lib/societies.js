'use client';

import { useSyncExternalStore } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getSocieties, setSocieties, subscribeSocieties, NO_SOCIETIES } from '@/data/societies';
import { storageGet, storageSet } from '@/lib/storage';

const COLUMNS = 'id, name, place, lat, lng, bg, fg';
let loading = null;

/** Loads the list cached on this device (instant, before any network) -- called once by
 *  Providers before the app renders, so returning visitors see their societies immediately. */
export function primeSocieties() {
  setSocieties(storageGet('societies', null));
}

/** Fetches the society list from Supabase once per page load (later calls share the same
 *  promise) and caches it for the next visit. Resolves to the list; on a network/database
 *  failure it resolves to whatever is already in memory rather than rejecting. */
export function loadSocieties() {
  if (!loading) {
    loading = createClient()
      .from('societies')
      .select(COLUMNS)
      .order('name')
      .then(({ data, error }) => {
        if (error) {
          loading = null; // let a later call retry
          return getSocieties();
        }
        setSocieties(data);
        storageSet('societies', data);
        return data;
      }, () => {
        loading = null;
        return getSocieties();
      });
  }
  return loading;
}

/** The current society list; re-renders the component whenever it changes. */
export function useSocieties() {
  return useSyncExternalStore(subscribeSocieties, getSocieties, () => NO_SOCIETIES);
}
