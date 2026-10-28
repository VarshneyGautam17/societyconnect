import { createSlice } from '@reduxjs/toolkit';

/* The resident-created business ("id: mine"). This is the single source of truth: once
   `published` is true, every page that reads `selectAllBusinesses` (home, directory, business
   detail, societies' counts) picks it up immediately because they all select from this slice. */
const initialState = {
  current: null
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    publishVendor(state, action) {
      state.current = { ...action.payload, published: true };
    },
    updateVendor(state, action) {
      if (state.current) state.current = { ...state.current, ...action.payload };
    },
    setVendor(state, action) {
      state.current = action.payload;
    },
    hydrateVendor(state, action) {
      state.current = action.payload;
    }
  }
});

export const { publishVendor, updateVendor, setVendor, hydrateVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
