import { configureStore } from '@reduxjs/toolkit';
import societyReducer from './slices/societySlice';
import vendorReducer from './slices/vendorSlice';
import savedReducer from './slices/savedSlice';
import eventsReducer from './slices/eventsSlice';
import enquiriesReducer from './slices/enquiriesSlice';
import accessReducer from './slices/accessSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      society: societyReducer,
      vendor: vendorReducer,
      saved: savedReducer,
      events: eventsReducer,
      enquiries: enquiriesReducer,
      access: accessReducer
    }
  });
}
