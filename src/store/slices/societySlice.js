import { createSlice } from '@reduxjs/toolkit';

/* `source` records how selectedId was chosen: 'default' (nobody chose yet -- first visit),
   'auto' (picked from the visitor's location, see SocietyAutoDetect), or 'manual' (the visitor
   picked it). Auto-detection only ever runs while it's 'default', so it never overrides a
   society someone chose themselves. `selectedId` is null until a society is chosen either way. */
const initialState = {
  selectedId: null,
  recent: [],
  source: 'default'
};

const societySlice = createSlice({
  name: 'society',
  initialState,
  reducers: {
    setSociety(state, action) {
      state.selectedId = action.payload;
      state.source = 'manual';
      state.recent = [action.payload, ...state.recent.filter((r) => r !== action.payload)].slice(0, 4);
    },
    autoSelectSociety(state, action) {
      state.selectedId = action.payload;
      state.source = 'auto';
    },
    hydrateSociety(state, action) {
      return { ...state, ...action.payload };
    }
  }
});

export const { setSociety, autoSelectSociety, hydrateSociety } = societySlice.actions;
export default societySlice.reducer;
