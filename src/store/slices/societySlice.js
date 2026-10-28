import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedId: 'prestige',
  recent: []
};

const societySlice = createSlice({
  name: 'society',
  initialState,
  reducers: {
    setSociety(state, action) {
      state.selectedId = action.payload;
      state.recent = [action.payload, ...state.recent.filter((r) => r !== action.payload)].slice(0, 4);
    },
    hydrateSociety(state, action) {
      return { ...state, ...action.payload };
    }
  }
});

export const { setSociety, hydrateSociety } = societySlice.actions;
export default societySlice.reducer;
