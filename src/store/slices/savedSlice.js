import { createSlice } from '@reduxjs/toolkit';

const initialState = { ids: [] };

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    toggleSaved(state, action) {
      const id = action.payload;
      const i = state.ids.indexOf(id);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.push(id);
    },
    hydrateSaved(state, action) {
      state.ids = action.payload;
    }
  }
});

export const { toggleSaved, hydrateSaved } = savedSlice.actions;
export default savedSlice.reducer;
