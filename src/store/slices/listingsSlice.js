import { createSlice } from '@reduxjs/toolkit';

/* Approved listings from Supabase, newest first -- loaded once per visit by src/lib/listings.js.
   `status` lets pages show skeletons while loading instead of an empty "nothing here" state. */
const initialState = {
  items: [],
  status: 'idle' // 'idle' | 'loading' | 'ready' | 'error'
};

const listingsSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    listingsLoading(state) {
      state.status = 'loading';
    },
    listingsLoaded(state, action) {
      state.items = action.payload;
      state.status = 'ready';
    },
    listingsFailed(state) {
      state.status = 'error';
    }
  }
});

export const { listingsLoading, listingsLoaded, listingsFailed } = listingsSlice.actions;
export default listingsSlice.reducer;
