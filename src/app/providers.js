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

export default function Providers({ children }) {
  const [store] = useState(makeStore);

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
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
