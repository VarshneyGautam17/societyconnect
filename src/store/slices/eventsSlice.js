import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: [] };

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    recordEvent(state, action) {
      const { type, id } = action.payload;
      state.list.push({ type, id, t: Date.now() });
      if (state.list.length > 200) state.list = state.list.slice(-200);
    },
    hydrateEvents(state, action) {
      state.list = action.payload;
    }
  }
});

export const { recordEvent, hydrateEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
