'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { hydrateSociety } from '@/store/slices/societySlice';
import { hydrateVendor } from '@/store/slices/vendorSlice';
import { hydrateSaved } from '@/store/slices/savedSlice';
import { hydrateEvents } from '@/store/slices/eventsSlice';
import { hydrateEnquiries } from '@/store/slices/enquiriesSlice';
import { hydrateAccess } from '@/store/slices/accessSlice';
import { storageGet, storageSet } from '@/lib/storage';
import { ToastProvider } from '@/components/ui/Toast';
import { FullScreenLoader } from '@/components/ui/Loaders';

export default function Providers({ children }) {
  const [store] = useState(makeStore);
  /* Everything saved to localStorage (saved access unlock, vendor session, saved businesses...)
     only exists in the browser, so the very first render -- both the server-rendered HTML and
     React's first client render before hydration -- has to assume none of it happened yet. That
     made the access gate (and anything else keyed off redux state) flash on for a frame on every
     reload: briefly "locked" before the real, already-unlocked state landed a tick later. Holding
     the whole app behind this flag until hydration has actually run removes that flash -- nothing
     renders with the wrong state, it just renders a beat later with the right one. */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* Hydrate from localStorage once, on mount (client only). */
    store.dispatch(hydrateSociety({
      selectedId: storageGet('society', 'prestige'),
      recent: storageGet('recent', [])
    }));
    store.dispatch(hydrateVendor(storageGet('vendor', null)));
    store.dispatch(hydrateSaved(storageGet('saved', [])));
    store.dispatch(hydrateEvents(storageGet('events', [])));
    store.dispatch(hydrateEnquiries(storageGet('enquiries', [])));
    store.dispatch(hydrateAccess(storageGet('access', { phone: null, unlocked: false })));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time localStorage hydration on mount, same pattern as onboarding/page.js
    setHydrated(true);

    /* Then keep localStorage in sync with every future change. */
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      storageSet('society', state.society.selectedId);
      storageSet('recent', state.society.recent);
      storageSet('vendor', state.vendor.current);
      storageSet('saved', state.saved.ids);
      storageSet('events', state.events.list);
      storageSet('enquiries', state.enquiries.list);
      storageSet('access', state.access);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <ToastProvider>
        {hydrated ? children : <FullScreenLoader />}
      </ToastProvider>
    </Provider>
  );
}
