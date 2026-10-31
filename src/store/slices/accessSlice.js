import { createSlice } from '@reduxjs/toolkit';

/* Gates the resident-facing site behind a WhatsApp-verified mobile number (see AccessGate and
   src/app/access/actions.js). The real session is an httpOnly cookie checked server-side; this
   slice (persisted to localStorage) is only a cache of it so a reload doesn't flash the gate --
   Providers re-confirms it against the server on every load and locks again if the session is
   gone. `verified` marks state written after a real OTP check, so an old self-reported unlock
   from before OTP existed is never trusted. */
const initialState = { phone: null, unlocked: false, verified: false };

const accessSlice = createSlice({
  name: 'access',
  initialState,
  reducers: {
    unlockAccess(state, action) {
      state.phone = action.payload;
      state.unlocked = true;
      state.verified = true;
    },
    lockAccess() {
      return initialState;
    },
    hydrateAccess(state, action) {
      return action.payload?.verified ? { ...state, ...action.payload } : initialState;
    }
  }
});

export const { unlockAccess, lockAccess, hydrateAccess } = accessSlice.actions;
export default accessSlice.reducer;
