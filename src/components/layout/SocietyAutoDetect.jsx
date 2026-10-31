'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { socShort } from '@/data/societies';
import { autoSelectSociety } from '@/store/slices/societySlice';
import { locateNearestSociety, NEAR_ENOUGH_KM } from '@/lib/useSocietyLocator';
import { storageGet, storageSet } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

/** First visit only: asks for the visitor's location once and selects the nearest society, so
 *  the home/directory pages open on the right society without a manual pick. Never runs again
 *  after that one attempt (allowed, blocked or too far away), and never overrides a society the
 *  visitor picked themselves (`source` !== 'default'). Renders nothing. */
export default function SocietyAutoDetect() {
  const dispatch = useDispatch();
  const store = useStore();
  const toast = useToast();
  const source = useSelector((state) => state.society.source);

  useEffect(() => {
    if (source !== 'default' || storageGet('geoAsked', false)) return;
    storageSet('geoAsked', true);

    /* Not cancelled on unmount: SiteShell remounts this on every page, and the location answer
       (often after a permission prompt) can arrive after the visitor has moved on -- the redux
       store and toast are app-wide, so applying it then is fine. What must not happen is
       overriding a society they picked while waiting, hence the fresh `source` check. */
    locateNearestSociety()
      .then(({ society, km }) => {
        if (km > NEAR_ENOUGH_KM || store.getState().society.source !== 'default') return;
        dispatch(autoSelectSociety(society.id));
        toast(`Showing ${socShort(society.id)}, nearest to you. You can change it anytime.`);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one attempt on first mount only
  }, []);

  return null;
}
