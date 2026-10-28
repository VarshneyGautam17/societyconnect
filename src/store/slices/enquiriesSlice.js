import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [] };

const enquiriesSlice = createSlice({
  name: 'enquiries',
  initialState,
  reducers: {
    addEnquiry(state, action) {
      state.list.unshift(action.payload);
      if (state.list.length > 50) state.list = state.list.slice(0, 50);
    },
    hydrateEnquiries(state, action) {
      state.list = action.payload;
    }
  }
});

export const { addEnquiry, hydrateEnquiries } = enquiriesSlice.actions;
export default enquiriesSlice.reducer;
