import { createSlice } from '@reduxjs/toolkit';

/* Gates full business details (the detail page, contact actions) behind a mobile number --
   residents can still browse basic cards on the landing/directory pages without it. This is a
   lead-capture step, not authentication: no OTP is sent (the one-time MSG91 phone-verification
   integration was removed from this app -- see git history), so `phone` is self-reported and
   only ever used to recognize a returning visitor on this device. */
const initialState = { phone: null, unlocked: false };

const accessSlice = createSlice({
  name: 'access',
  initialState,
  reducers: {
    unlockAccess(state, action) {
      state.phone = action.payload;
      state.unlocked = true;
    },
    hydrateAccess(state, action) {
      return { ...state, ...action.payload };
    }
  }
});

export const { unlockAccess, hydrateAccess } = accessSlice.actions;
export default accessSlice.reducer;
